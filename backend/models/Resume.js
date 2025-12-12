const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  title: {
    type: String,
    default: 'Resume'
  },
  content: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String,
      summary: String
    },
    experience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
      highlights: [String]
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      grade: String
    }],
    skills: {
      technical: [String],
      soft: [String],
      languages: [String],
      tools: [String]
    },
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      url: String,
      github: String,
      highlights: [String]
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      url: String
    }],
    achievements: [String],
    extracurricular: [String]
  },
  tailoredFor: {
    jobTitle: String,
    company: String,
    keywords: [String]
  },
  template: {
    type: String,
    default: 'professional'
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  // File upload support
  uploadedFile: {
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: Date
  },
  // Extracted text from uploaded file
  extractedText: {
    type: String
  },
  pdfUrl: String,
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
