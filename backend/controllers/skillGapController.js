const SkillGap = require('../models/SkillGap');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const geminiService = require('../services/geminiService');
const githubService = require('../services/githubService');
const User = require('../models/User');

/**
 * @desc    Analyze skill gap for a job
 * @route   POST /api/skill-gap/analyze
 * @access  Private
 */
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { jobId, resumeId, githubUsername, resumeText } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Step 1: Extract required skills from job description
    console.log('Extracting skills from job description...');
    const jobSkillsData = await geminiService.extractSkillsFromJobDescription(
      job.description + '\n\n' + (job.requirements || []).join('\n')
    );

    const requiredSkills = jobSkillsData.skills || [];

    // Step 2: Extract user skills from resume
    let resumeSkills = [];
    let resumeSource = 'github_only';
    
    if (resumeText) {
      // User provided resume text directly
      console.log('Extracting skills from provided resume text...');
      const resumeSkillsData = await geminiService.extractSkillsFromResume(resumeText);
      resumeSkills = (resumeSkillsData.skills || []).map(skill => ({
        name: skill.name,
        source: 'resume',
        proficiencyLevel: skill.proficiencyLevel || 'intermediate'
      }));
      resumeSource = 'uploaded';
    } else if (resumeId) {
      // Use existing resume
      const resume = await Resume.findById(resumeId);
      if (resume && resume.user.toString() === userId.toString()) {
        console.log('Extracting skills from existing resume...');
        const resumeContent = JSON.stringify(resume.content);
        const resumeSkillsData = await geminiService.extractSkillsFromResume(resumeContent);
        resumeSkills = (resumeSkillsData.skills || []).map(skill => ({
          name: skill.name,
          source: 'resume',
          proficiencyLevel: skill.proficiencyLevel || 'intermediate'
        }));
        resumeSource = 'existing';
      }
    }

    // Step 3: Extract skills from GitHub
    let githubSkills = [];
    let githubAnalyzed = false;
    const username = githubUsername || req.user.githubUsername;

    if (username) {
      try {
        console.log('Extracting skills from GitHub...');
        const githubSkillsData = await githubService.extractSkillsFromGitHub(username);
        githubSkills = githubSkillsData.skills || [];
        githubAnalyzed = true;
      } catch (error) {
        console.warn('Could not extract GitHub skills:', error.message);
      }
    }

    // Step 4: Combine user skills from resume and GitHub
    const userSkillsMap = new Map();
    
    // Add resume skills
    resumeSkills.forEach(skill => {
      userSkillsMap.set(skill.name.toLowerCase(), skill);
    });

    // Add or update with GitHub skills
    githubSkills.forEach(skill => {
      const key = skill.name.toLowerCase();
      if (userSkillsMap.has(key)) {
        // Skill exists in both - mark as 'both'
        const existing = userSkillsMap.get(key);
        existing.source = 'both';
        // Keep higher proficiency
        if (skill.proficiencyLevel === 'advanced' || existing.proficiencyLevel === 'beginner') {
          existing.proficiencyLevel = skill.proficiencyLevel;
        }
      } else {
        userSkillsMap.set(key, skill);
      }
    });

    const userSkills = Array.from(userSkillsMap.values());

    // Step 5: Analyze gaps using AI
    console.log('Analyzing skill gaps...');
    const gapAnalysis = await geminiService.analyzeSkillGaps(
      requiredSkills,
      userSkills,
      job.title,
      job.description
    );

    // Step 6: Save analysis to database
    const skillGapAnalysis = await SkillGap.create({
      user: userId,
      job: jobId,
      analysis: {
        requiredSkills,
        userSkills,
        matchingSkills: gapAnalysis.matchingSkills || [],
        missingSkills: gapAnalysis.missingSkills || [],
        matchScore: gapAnalysis.matchScore || 0,
        recommendations: {
          courses: gapAnalysis.courses || [],
          videos: gapAnalysis.videos || [],
          studyPlan: gapAnalysis.studyPlan || { totalDuration: 'N/A', phases: [] },
          projects: gapAnalysis.projects || []
        }
      },
      resumeSource,
      githubAnalyzed
    });

    res.json({
      success: true,
      message: 'Skill gap analysis completed successfully',
      data: skillGapAnalysis
    });
  } catch (error) {
    console.error('Skill Gap Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze skill gap'
    });
  }
};

/**
 * @desc    Get skill gap analysis for a job
 * @route   GET /api/skill-gap/job/:jobId
 * @access  Private
 */
exports.getSkillGapByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const analysis = await SkillGap.findOne({
      user: userId,
      job: jobId
    })
      .populate('job', 'title company location jobType')
      .sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No skill gap analysis found for this job'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all skill gap analyses for user
 * @route   GET /api/skill-gap
 * @access  Private
 */
exports.getAllSkillGaps = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, sortBy = '-createdAt' } = req.query;

    const analyses = await SkillGap.find({ user: userId })
      .populate('job', 'title company location jobType')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SkillGap.countDocuments({ user: userId });

    res.json({
      success: true,
      data: analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete skill gap analysis
 * @route   DELETE /api/skill-gap/:id
 * @access  Private
 */
exports.deleteSkillGap = async (req, res) => {
  try {
    const analysis = await SkillGap.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Skill gap analysis not found'
      });
    }

    // Check ownership
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this analysis'
      });
    }

    await analysis.deleteOne();

    res.json({
      success: true,
      message: 'Skill gap analysis deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get skill gap statistics
 * @route   GET /api/skill-gap/stats
 * @access  Private
 */
exports.getSkillGapStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const analyses = await SkillGap.find({ user: userId });

    if (analyses.length === 0) {
      return res.json({
        success: true,
        data: {
          totalAnalyses: 0,
          averageMatchScore: 0,
          topMissingSkills: [],
          analyzedJobs: 0
        }
      });
    }

    // Calculate statistics
    const totalAnalyses = analyses.length;
    const averageMatchScore = analyses.reduce((sum, a) => sum + (a.analysis.matchScore || 0), 0) / totalAnalyses;

    // Aggregate missing skills
    const missingSkillsMap = new Map();
    analyses.forEach(analysis => {
      (analysis.analysis.missingSkills || []).forEach(skill => {
        const count = missingSkillsMap.get(skill.name) || 0;
        missingSkillsMap.set(skill.name, count + 1);
      });
    });

    // Sort by frequency
    const topMissingSkills = Array.from(missingSkillsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalAnalyses,
        averageMatchScore: Math.round(averageMatchScore),
        topMissingSkills,
        analyzedJobs: totalAnalyses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
