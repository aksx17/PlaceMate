const mongoose = require('mongoose');

const networkingContactSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true
  },
  profilePicture: String,
  
  // Current Position
  currentRole: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: String,
  
  // Educational Background
  education: [{
    institution: String,
    degree: String,
    field: String,
    department: String, // CSE, ECE, ME, etc.
    graduationYear: Number
  }],
  
  // Skills & Expertise
  skills: [String],
  expertise: [String],
  
  // Contact Information
  contactLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    email: String,
    portfolio: String,
    kaggle: String,
    medium: String,
    website: String
  },
  
  // Professional Details
  experience: {
    totalYears: Number,
    previousCompanies: [String],
    previousRoles: [String]
  },
  
  // Engagement Metrics
  isVerified: {
    type: Boolean,
    default: false
  },
  responseRate: Number, // 0-100
  averageResponseTime: String, // e.g., "1-2 days"
  
  // Metadata
  source: {
    type: String,
    enum: ['linkedin', 'github', 'kaggle', 'manual', 'imported'],
    default: 'manual'
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // For alumni matching
  isAlumni: {
    type: Boolean,
    default: false
  },
  alumniOf: [String], // List of institutions
  
  // Additional Info
  bio: String,
  achievements: [String],
  openToMentoring: {
    type: Boolean,
    default: false
  },
  
  // Search optimization
  searchKeywords: [String]
}, {
  timestamps: true
});

// Indexes for efficient searching
networkingContactSchema.index({ company: 1, currentRole: 1 });
networkingContactSchema.index({ skills: 1 });
networkingContactSchema.index({ alumniOf: 1 });
networkingContactSchema.index({ 'education.institution': 1 });
networkingContactSchema.index({ searchKeywords: 'text', name: 'text', currentRole: 'text' });

module.exports = mongoose.model('NetworkingContact', networkingContactSchema);
