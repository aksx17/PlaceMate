const Interview = require('../models/Interview');
const Job = require('../models/Job');
const geminiService = require('../services/geminiService');
const githubService = require('../services/githubService');
const { v4: uuidv4 } = require('uuid');

// Note: Install uuid package: npm install uuid

// @desc    Generate interview questions
// @route   POST /api/interview/generate-questions
exports.generateQuestions = async (req, res) => {
  try {
    const { jobId, githubUsername, linkedinData, difficulty = 'medium' } = req.body;
    const userId = req.user._id;

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Fetch GitHub data with fallback to user's saved username
    let githubData = {};
    const username = githubUsername || req.user.githubUsername;
    
    if (username) {
      try {
        githubData = await githubService.getComprehensiveUserData(username);
      } catch (error) {
        console.warn(`⚠️ Could not fetch GitHub data for username: ${username}`);
        // Continue without GitHub data
        githubData = {
          projects: [],
          skills: { languages: [], topics: [] }
        };
      }
    } else {
      console.warn('⚠️ No GitHub username provided');
      githubData = {
        projects: [],
        skills: { languages: [], topics: [] }
      };
    }

    // Prepare user data
    const userData = {
      githubProjects: githubData.projects || [],
      linkedinData: linkedinData || {},
      skills: [...(githubData.skills?.languages || []), ...(req.user.skills || [])]
    };

    // Generate questions using Gemini AI
    const questions = await geminiService.generateInterviewQuestions(
      userData,
      job.description,
      difficulty
    );

    // Create interview session
    const interview = await Interview.create({
      user: userId,
      job: jobId,
      sessionId: uuidv4(),
      questions: questions.map(q => ({
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        expectedAnswer: q.expectedAnswer,
        keyPoints: q.keyPoints
      })),
      status: 'in-progress'
    });

    res.json({
      success: true,
      message: 'Interview questions generated successfully',
      data: {
        sessionId: interview.sessionId,
        questions: interview.questions.map(q => ({
          _id: q._id,
          question: q.question,
          category: q.category,
          difficulty: q.difficulty,
          expectedAnswer: q.expectedAnswer // Include expected answer for frontend
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit answer to question
// @route   POST /api/interview/:sessionId/answer
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;

    const interview = await Interview.findOne({ sessionId });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Find the question
    const question = interview.questions.id(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Evaluate answer using Gemini AI
    const evaluation = await geminiService.evaluateAnswer(
      question.question,
      answer,
      question.expectedAnswer
    );

    // Update question with answer and evaluation
    question.userAnswer = answer;
    question.feedback = evaluation.feedback;
    question.score = evaluation.score;
    question.answeredAt = new Date();

    await interview.save();

    res.json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get interview session
// @route   GET /api/interview/:sessionId
exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ sessionId: req.params.sessionId })
      .populate('job', 'title company')
      .populate('user', 'name email');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete interview and get overall feedback
// @route   POST /api/interview/:sessionId/complete
exports.completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ sessionId: req.params.sessionId });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Calculate overall score
    const answeredQuestions = interview.questions.filter(q => q.score !== undefined);
    const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
    const overallScore = answeredQuestions.length > 0 
      ? Math.round((totalScore / (answeredQuestions.length * 10)) * 100) 
      : 0;

    // Compile feedback
    const allFeedback = answeredQuestions.map(q => q.feedback).filter(f => f);
    
    interview.overallScore = overallScore;
    interview.status = 'completed';
    interview.feedback = {
      overall: `You scored ${overallScore}% overall. ${
        overallScore >= 80 ? 'Excellent performance!' :
        overallScore >= 60 ? 'Good job! Keep practicing.' :
        'Keep learning and practicing.'
      }`
    };

    await interview.save();

    res.json({
      success: true,
      message: 'Interview completed',
      data: {
        overallScore,
        feedback: interview.feedback,
        questionsAnswered: answeredQuestions.length,
        totalQuestions: interview.questions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's interview history
// @route   GET /api/interview/history
exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .populate('job', 'title company')
      .sort('-createdAt')
      .select('sessionId job overallScore status createdAt');

    res.json({
      success: true,
      data: interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
