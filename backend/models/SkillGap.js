const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  analysis: {
    // Required skills from job description
    requiredSkills: [{
      name: String,
      category: {
        type: String,
        enum: ['programming_language', 'framework', 'tool', 'database', 'cloud', 'soft_skill', 'other']
      },
      importance: {
        type: String,
        enum: ['required', 'preferred', 'nice_to_have']
      }
    }],
    
    // User's current skills from resume + GitHub
    userSkills: [{
      name: String,
      source: {
        type: String,
        enum: ['resume', 'github', 'both']
      },
      proficiencyLevel: String // beginner, intermediate, advanced
    }],
    
    // Matching skills
    matchingSkills: [{
      name: String,
      confidence: Number // 0-100
    }],
    
    // Skill gaps
    missingSkills: [{
      name: String,
      category: String,
      importance: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      }
    }],
    
    // Overall match score
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // Recommendations
    recommendations: {
      // Learning resources
      courses: [{
        title: String,
        platform: String,
        url: String,
        duration: String,
        skill: String,
        isPaid: Boolean
      }],
      
      // YouTube playlists
      videos: [{
        title: String,
        channel: String,
        url: String,
        skill: String,
        duration: String
      }],
      
      // Study plan
      studyPlan: {
        totalDuration: String, // e.g., "4-6 weeks"
        phases: [{
          phase: Number,
          title: String,
          duration: String,
          skills: [String],
          description: String,
          milestones: [String]
        }]
      },
      
      // Project recommendations
      projects: [{
        title: String,
        description: String,
        skillsCovered: [String],
        difficulty: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard']
        },
        estimatedTime: String,
        keyFeatures: [String],
        technologies: [String]
      }]
    }
  },
  
  // Metadata
  resumeSource: {
    type: String,
    enum: ['uploaded', 'existing', 'github_only']
  },
  
  githubAnalyzed: {
    type: Boolean,
    default: false
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
skillGapSchema.index({ user: 1, job: 1 });
skillGapSchema.index({ 'analysis.matchScore': -1 });
skillGapSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SkillGap', skillGapSchema);
