const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    default: 'modern',
    enum: ['modern', 'minimal', 'creative', 'professional']
  },
  customUrl: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    match: /^[a-z0-9-]+$/
  },
  content: {
    about: {
      headline: String,
      bio: String,
      profileImage: String,
      resumeUrl: String
    },
    contact: {
      email: String,
      phone: String,
      location: String,
      social: {
        github: String,
        linkedin: String,
        twitter: String,
        website: String
      }
    },
    skills: [{
      category: String,
      items: [{
        name: String,
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert']
        }
      }]
    }],
    projects: [{
      title: String,
      description: String,
      image: String,
      technologies: [String],
      features: [String],
      demoUrl: String,
      githubUrl: String,
      featured: Boolean,
      startDate: Date,
      endDate: Date
    }],
    experience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
      achievements: [String],
      logo: String
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      grade: String,
      logo: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      url: String,
      image: String
    }],
    testimonials: [{
      name: String,
      position: String,
      company: String,
      content: String,
      image: String
    }]
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
