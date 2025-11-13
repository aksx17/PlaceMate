const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  questions: [{
    question: String,
    category: {
      type: String,
      enum: ['technical', 'behavioral', 'situational', 'company-specific']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    userAnswer: String,
    expectedAnswer: String,
    keyPoints: [String],
    feedback: String,
    score: Number,
    timeSpent: Number, // in seconds
    answeredAt: Date
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    strengths: [String],
    improvements: [String],
    overall: String
  },
  duration: Number, // in minutes
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  avatarConfig: {
    avatarUrl: String,
    voiceId: String,
    gender: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);
