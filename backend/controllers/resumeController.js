const Resume = require('../models/Resume');
const Job = require('../models/Job');
const geminiService = require('../services/geminiService');
const githubService = require('../services/githubService');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../temp/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF and DOCX files
  if (file.mimetype === 'application/pdf' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

exports.uploadMiddleware = upload.single('resume');

// @desc    Generate AI-tailored resume
// @route   POST /api/resume/generate
exports.generateResume = async (req, res) => {
  try {
    const { jobId, githubUsername, linkedinData } = req.body;
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

    // Prepare user data for AI
    const userData = {
      githubProjects: githubData.projects || [],
      linkedinData: linkedinData || {},
      skills: [...(githubData.skills?.languages || []), ...(req.user.skills || [])]
    };

    // Generate resume content using Gemini AI
    const aiContent = await geminiService.generateResumeContent(
      userData,
      job.description
    );

    // Create resume document
    const resume = await Resume.create({
      user: userId,
      job: jobId,
      title: `Resume for ${job.title} at ${job.company}`,
      content: {
        personalInfo: {
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          github: username ? `https://github.com/${username}` : null,
          linkedin: req.user.linkedinUrl,
          summary: aiContent.summary
        },
        skills: {
          technical: aiContent.skills,
          tools: githubData.skills?.topics || []
        },
        projects: aiContent.projects || githubData.projects?.slice(0, 5) || [],
        experience: req.user.experience || [],
        education: req.user.education || [],
        certifications: req.user.certifications || []
      },
      tailoredFor: {
        jobTitle: job.title,
        company: job.company,
        keywords: aiContent.keywords
      },
      aiGenerated: true
    });

    res.json({
      success: true,
      message: 'Resume generated successfully',
      data: resume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user resumes
// @route   GET /api/resume
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .populate('job', 'title company')
      .sort('-createdAt');

    res.json({
      success: true,
      data: resumes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate('job');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resume/:id
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: { content: req.body.content } },
      { new: true }
    );

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate PDF resume
// @route   GET /api/resume/:id/pdf
exports.generatePDF = async (req, res) => {
  try {
    console.log('📄 PDF Generation requested for resume:', req.params.id);
    
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      console.log('❌ Resume not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    console.log('✓ Resume found, generating PDF...');
    
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `resume_${resume._id}.pdf`;
    const tempDir = path.join(__dirname, '../temp');
    const filePath = path.join(tempDir, fileName);

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      console.log('Creating temp directory...');
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(24).text(resume.content.personalInfo.name, { align: 'center' });
    doc.fontSize(10).text(resume.content.personalInfo.email, { align: 'center' });
    doc.text(resume.content.personalInfo.phone, { align: 'center' });
    doc.moveDown();

    // Summary
    if (resume.content.personalInfo.summary) {
      doc.fontSize(14).text('Professional Summary', { underline: true });
      doc.fontSize(10).text(resume.content.personalInfo.summary);
      doc.moveDown();
    }

    // Skills
    if (resume.content.skills.technical?.length) {
      doc.fontSize(14).text('Technical Skills', { underline: true });
      doc.fontSize(10).text(resume.content.skills.technical.join(', '));
      doc.moveDown();
    }

    // Projects
    if (resume.content.projects?.length) {
      doc.fontSize(14).text('Projects', { underline: true });
      resume.content.projects.forEach(project => {
        doc.fontSize(12).text(project.name, { bold: true });
        doc.fontSize(10).text(project.description);
        if (project.technologies?.length) {
          doc.text(`Technologies: ${project.technologies.join(', ')}`);
        }
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Experience
    if (resume.content.experience?.length) {
      doc.fontSize(14).text('Experience', { underline: true });
      resume.content.experience.forEach(exp => {
        doc.fontSize(12).text(`${exp.position} at ${exp.company}`);
        doc.fontSize(10).text(`${exp.startDate?.toLocaleDateString()} - ${exp.current ? 'Present' : exp.endDate?.toLocaleDateString()}`);
        doc.text(exp.description);
        doc.moveDown(0.5);
      });
    }

    doc.end();

    writeStream.on('finish', () => {
      console.log('✓ PDF generated successfully');
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('❌ Error sending file:', err);
        } else {
          console.log('✓ PDF sent to client');
        }
        // Delete temp file after sending
        try {
          fs.unlinkSync(filePath);
          console.log('✓ Temp file deleted');
        } catch (unlinkErr) {
          console.error('⚠️ Error deleting temp file:', unlinkErr);
        }
      });
    });

    writeStream.on('error', (err) => {
      console.error('❌ Error writing PDF:', err);
      res.status(500).json({
        success: false,
        message: 'Error generating PDF'
      });
    });
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload resume file and extract text
// @route   POST /api/resume/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file'
      });
    }

    const userId = req.user._id;
    const file = req.file;

    // Extract text based on file type
    let extractedText = '';
    
    if (file.mimetype === 'application/pdf') {
      // Extract text from PDF
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.mimetype === 'application/msword') {
      // Extract text from DOCX
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value;
    }

    // Create resume document with uploaded file info
    const resume = await Resume.create({
      user: userId,
      title: req.body.title || file.originalname,
      uploadedFile: {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
      },
      extractedText: extractedText,
      content: {
        personalInfo: {
          name: req.user.name,
          email: req.user.email
        }
      }
    });

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeId: resume._id,
        filename: file.originalname,
        extractedText: extractedText.substring(0, 500) + '...', // Preview
        fullTextLength: extractedText.length
      }
    });
  } catch (error) {
    console.error('❌ Resume Upload Error:', error);
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resume'
    });
  }
};

// @desc    Get extracted text from uploaded resume
// @route   GET /api/resume/:id/text
exports.getResumeText = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    res.json({
      success: true,
      data: {
        resumeId: resume._id,
        extractedText: resume.extractedText || '',
        uploadedFile: resume.uploadedFile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

