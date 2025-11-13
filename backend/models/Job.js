const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
  },
  workMode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
  },
  experience: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      default: 'years'
    }
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      enum: ['yearly', 'monthly', 'hourly'],
      default: 'yearly'
    }
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  responsibilities: [String],
  techStack: [String],
  benefits: [String],
  applicationUrl: {
    type: String,
    required: true
  },
  companyLogo: String,
  source: {
    type: String,
    enum: ['linkedin', 'glassdoor', 'naukri', 'unstop', 'indeed'],
    required: true
  },
  sourceJobId: {
    type: String,
    unique: true,
    sparse: true
  },
  postedDate: Date,
  expiryDate: Date,
  applicants: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    scrapedAt: {
      type: Date,
      default: Date.now
    },
    lastUpdated: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient filtering
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ techStack: 1 });
jobSchema.index({ source: 1 });
jobSchema.index({ isActive: 1 });

module.exports = mongoose.model('Job', jobSchema);
