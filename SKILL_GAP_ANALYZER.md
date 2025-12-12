# Skill Gap Analyzer Feature Documentation

## Overview
The Skill Gap Analyzer is a comprehensive feature that helps users identify skill gaps between their current skillset and job requirements. It provides personalized learning paths, course recommendations, and project suggestions to bridge those gaps.

## Features

### 1. **Intelligent Skill Extraction**
- **Job Analysis**: Automatically extracts required skills from job descriptions using AI
- **Resume Parsing**: Supports PDF and DOCX file uploads with text extraction
- **GitHub Integration**: Analyzes user's GitHub repositories to identify technical skills
- **Skill Categorization**: Classifies skills into categories (programming languages, frameworks, tools, databases, cloud, soft skills)

### 2. **Comprehensive Gap Analysis**
- **Matching Skills**: Identifies skills the user already possesses
- **Missing Skills**: Highlights skills that need to be learned
- **Priority Assessment**: Assigns priority levels (high/medium/low) to missing skills
- **Match Score**: Provides an overall percentage match between user skills and job requirements

### 3. **Personalized Recommendations**

#### Learning Resources
- **Online Courses**: Curated list of courses from platforms like Udemy, Coursera, freeCodeCamp
- **YouTube Playlists**: Relevant video tutorials and channels
- **Free & Paid Options**: Mix of free and premium resources

#### Study Plan
- **Phase-based Learning**: Structured learning path broken into manageable phases
- **Time Estimates**: Realistic duration for each phase and overall completion
- **Milestones**: Clear checkpoints to track progress
- **Skill Coverage**: Each phase focuses on specific skills

#### Project Recommendations
- **Hands-on Projects**: 3-5 project ideas to build and demonstrate skills
- **Difficulty Levels**: Beginner, intermediate, and advanced projects
- **Technology Stack**: Specific technologies to use in each project
- **Key Features**: Detailed features to implement
- **Time Estimates**: Expected completion time for each project

## API Endpoints

### Skill Gap Analysis
```
POST /api/skill-gap/analyze
```
**Request Body:**
```json
{
  "jobId": "string (required)",
  "resumeId": "string (optional)",
  "githubUsername": "string (optional)",
  "resumeText": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill gap analysis completed successfully",
  "data": {
    "_id": "analysis_id",
    "user": "user_id",
    "job": "job_id",
    "analysis": {
      "matchScore": 65,
      "requiredSkills": [...],
      "userSkills": [...],
      "matchingSkills": [...],
      "missingSkills": [...],
      "recommendations": {
        "courses": [...],
        "videos": [...],
        "studyPlan": {...},
        "projects": [...]
      }
    }
  }
}
```

### Get Analysis by Job
```
GET /api/skill-gap/job/:jobId
```

### Get All Analyses
```
GET /api/skill-gap?page=1&limit=10
```

### Get Statistics
```
GET /api/skill-gap/stats
```

### Delete Analysis
```
DELETE /api/skill-gap/:id
```

### Resume Upload
```
POST /api/resume/upload
```
**Content-Type:** `multipart/form-data`
**Form Data:**
- `resume`: File (PDF or DOCX)
- `title`: String (optional)

## Frontend Usage

### Navigate to Skill Gap Analyzer
```javascript
// From Jobs page
<button onClick={() => navigate(`/skill-gap/${job._id}`)}>
  Analyze Skills
</button>
```

### Component Structure
```
SkillGap.jsx
├── Input Section
│   ├── Resume Upload
│   └── GitHub Username Input
├── Analysis Results
│   ├── Overview Tab
│   │   ├── Match Score
│   │   ├── Matching Skills
│   │   └── Missing Skills
│   ├── Skills Tab
│   │   └── User Skills with Sources
│   ├── Courses Tab
│   │   ├── Recommended Courses
│   │   └── YouTube Videos
│   ├── Study Plan Tab
│   │   └── Phase-based Learning Path
│   └── Projects Tab
│       └── Project Recommendations
```

## Database Models

### SkillGap Model
```javascript
{
  user: ObjectId,
  job: ObjectId,
  analysis: {
    requiredSkills: [{
      name: String,
      category: String,
      importance: String
    }],
    userSkills: [{
      name: String,
      source: String,
      proficiencyLevel: String
    }],
    matchingSkills: [{
      name: String,
      confidence: Number
    }],
    missingSkills: [{
      name: String,
      category: String,
      importance: String,
      priority: String
    }],
    matchScore: Number,
    recommendations: {
      courses: [...],
      videos: [...],
      studyPlan: {...},
      projects: [...]
    }
  },
  resumeSource: String,
  githubAnalyzed: Boolean,
  timestamps: true
}
```

## How It Works

### 1. **User Input**
- User uploads their resume (PDF/DOCX) OR
- User provides their GitHub username OR
- Both

### 2. **Skill Extraction Process**

#### From Job Description
- AI analyzes job description
- Extracts required skills with categorization
- Identifies importance levels (required/preferred/nice-to-have)

#### From Resume
- Parses uploaded file (PDF/DOCX)
- Extracts text content
- AI identifies technical and soft skills
- Estimates proficiency levels based on context

#### From GitHub
- Fetches user's repositories
- Analyzes programming languages used
- Extracts topics and technologies
- Estimates proficiency based on repository count and stars

### 3. **Gap Analysis**
- Compares required skills with user skills
- Identifies matching skills with confidence scores
- Highlights missing skills with priority levels
- Calculates overall match percentage

### 4. **Recommendation Generation**
- AI generates personalized learning resources
- Creates structured study plan with phases
- Suggests practical projects to build
- Provides mix of free and paid resources

## Usage Examples

### Example 1: Upload Resume and Analyze
```javascript
// 1. User uploads resume
const formData = new FormData();
formData.append('resume', file);
await api.post('/resume/upload', formData);

// 2. Analyze skill gap
await api.post('/skill-gap/analyze', {
  jobId: 'job_123',
  resumeId: 'resume_456',
  githubUsername: 'johndoe'
});
```

### Example 2: GitHub Only Analysis
```javascript
await api.post('/skill-gap/analyze', {
  jobId: 'job_123',
  githubUsername: 'johndoe'
});
```

### Example 3: Resume Text Only
```javascript
await api.post('/skill-gap/analyze', {
  jobId: 'job_123',
  resumeText: '... extracted resume text ...'
});
```

## Benefits

### For Job Seekers
- **Clear Direction**: Know exactly what skills to learn
- **Structured Learning**: Follow a organized study plan
- **Resource Efficiency**: Get curated learning resources
- **Portfolio Building**: Build relevant projects to showcase skills
- **Confidence**: Apply to jobs knowing your skill match percentage

### For Career Switchers
- **Gap Identification**: Understand what's missing from current skillset
- **Timeline Planning**: Realistic time estimates for skill acquisition
- **Project Ideas**: Build portfolio projects in new domain
- **Learning Path**: Step-by-step guidance for career transition

### For Students
- **Market Alignment**: Align learning with industry requirements
- **Skill Prioritization**: Focus on high-priority skills first
- **Practical Application**: Learn through project-based approach
- **Resource Discovery**: Find best learning materials

## Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
```

### File Upload Limits
- Max file size: 5MB
- Supported formats: PDF, DOCX, DOC
- Upload directory: `backend/temp/uploads`

## Error Handling

### Common Errors
1. **File Upload Failed**: Check file size and format
2. **GitHub API Error**: Verify username and API token
3. **Analysis Failed**: Ensure valid job ID and input data
4. **AI Processing Error**: Check Gemini API key and quota

### Error Messages
```javascript
{
  "success": false,
  "message": "Detailed error message"
}
```

## Future Enhancements

1. **LinkedIn Integration**: Extract skills from LinkedIn profiles
2. **Progress Tracking**: Track learning progress through study plan
3. **Skill Verification**: Add ability to verify completed skills
4. **Interview Preparation**: Generate interview questions for missing skills
5. **Peer Comparison**: Compare skill match with other candidates
6. **Automated Alerts**: Notify when new resources are available
7. **Mobile App**: Mobile version for on-the-go analysis
8. **Certification Recommendations**: Suggest relevant certifications

## Best Practices

### For Users
1. Keep resume updated with latest experiences
2. Maintain active GitHub profile with meaningful projects
3. Review recommendations regularly
4. Track progress through study plan
5. Build recommended projects for portfolio

### For Developers
1. Cache AI responses to reduce API calls
2. Implement rate limiting for analysis requests
3. Validate file uploads thoroughly
4. Handle GitHub API rate limits gracefully
5. Store analysis results for quick retrieval
6. Monitor AI API usage and costs

## Security Considerations

1. **File Upload**: Validate file types and sizes
2. **Data Privacy**: Don't store sensitive resume data longer than necessary
3. **API Keys**: Keep AI and GitHub tokens secure
4. **User Authorization**: Ensure users can only access their own analyses
5. **Input Sanitization**: Sanitize all user inputs before AI processing

## Performance Tips

1. **Parallel Processing**: Extract skills from resume and GitHub simultaneously
2. **Caching**: Cache job skill extractions for popular jobs
3. **Pagination**: Limit result sizes for large datasets
4. **Async Operations**: Use background jobs for heavy processing
5. **Database Indexing**: Index user and job fields for faster queries

## Support

For issues or questions:
- Check error logs in backend console
- Verify API keys are configured correctly
- Ensure all dependencies are installed
- Check file permissions for upload directory

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintainer**: PlaceMate Team
