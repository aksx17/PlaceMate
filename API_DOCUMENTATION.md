# 📚 PlaceMate API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "githubUsername": "johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "githubUsername": "johndoe",
    "token": "jwt_token_here"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User Profile
```http
GET /api/auth/profile
```
🔒 Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "savedJobs": [],
    "appliedJobs": []
  }
}
```

### Update Profile
```http
PUT /api/auth/profile
```
🔒 Protected

**Request Body:**
```json
{
  "name": "John Updated",
  "skills": ["JavaScript", "React", "Node.js"],
  "phone": "+1234567890"
}
```

---

## 💼 Jobs Endpoints

### Get All Jobs
```http
GET /api/jobs?search=software&location=bangalore&page=1&limit=20
```

**Query Parameters:**
- `search` - Search keyword
- `location` - Job location
- `jobType` - full-time, part-time, internship, contract
- `techStack` - Comma-separated tech stack (e.g., React,Node.js)
- `source` - linkedin, glassdoor, naukri, unstop, indeed
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "job_id",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "Bangalore",
      "jobType": "full-time",
      "salary": {
        "min": 800000,
        "max": 1200000,
        "currency": "INR"
      },
      "techStack": ["JavaScript", "React", "Node.js"],
      "description": "...",
      "applicationUrl": "https://...",
      "source": "linkedin"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Single Job
```http
GET /api/jobs/:id
```

### Get Job Statistics
```http
GET /api/jobs/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1500,
    "bySource": [
      { "_id": "linkedin", "count": 300 },
      { "_id": "naukri", "count": 400 }
    ],
    "lastUpdated": "2025-11-10T10:30:00.000Z"
  }
}
```

### Scrape Jobs
```http
POST /api/jobs/scrape
```
🔒 Protected

**Request Body:**
```json
{
  "source": "all",
  "keywords": "software engineer",
  "location": "India"
}
```

### Save Job
```http
POST /api/jobs/:id/save
```
🔒 Protected

### Apply to Job
```http
POST /api/jobs/:id/apply
```
🔒 Protected

---

## 📄 Resume Endpoints

### Generate Resume
```http
POST /api/resume/generate
```
🔒 Protected

**Request Body:**
```json
{
  "jobId": "job_id_here",
  "githubUsername": "johndoe",
  "linkedinData": {
    "headline": "Software Engineer",
    "summary": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume generated successfully",
  "data": {
    "_id": "resume_id",
    "title": "Resume for Software Engineer at Tech Corp",
    "content": {
      "personalInfo": {...},
      "skills": {...},
      "projects": [...]
    },
    "aiGenerated": true
  }
}
```

### Get All Resumes
```http
GET /api/resume
```
🔒 Protected

### Get Single Resume
```http
GET /api/resume/:id
```
🔒 Protected

### Update Resume
```http
PUT /api/resume/:id
```
🔒 Protected

**Request Body:**
```json
{
  "content": {
    "personalInfo": {...},
    "skills": {...}
  }
}
```

### Download Resume PDF
```http
GET /api/resume/:id/pdf
```
🔒 Protected

Returns PDF file for download.

---

## 🎨 Portfolio Endpoints

### Generate Portfolio
```http
POST /api/portfolio/generate
```
🔒 Protected

**Request Body:**
```json
{
  "githubUsername": "johndoe",
  "theme": "modern",
  "linkedinData": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "portfolio_id",
    "customUrl": "johndoe",
    "theme": "modern",
    "content": {
      "about": {...},
      "skills": [...],
      "projects": [...]
    },
    "published": false
  }
}
```

### Get Portfolio
```http
GET /api/portfolio/:userId
```

### Update Portfolio
```http
PUT /api/portfolio/:id
```
🔒 Protected

### Toggle Publish Status
```http
PATCH /api/portfolio/:id/publish
```
🔒 Protected

### Export Portfolio as HTML
```http
GET /api/portfolio/:id/export
```

Returns HTML file for download.

---

## 🎤 Interview Endpoints

### Generate Interview Questions
```http
POST /api/interview/generate-questions
```
🔒 Protected

**Request Body:**
```json
{
  "jobId": "job_id_here",
  "githubUsername": "johndoe",
  "linkedinData": {},
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "unique_session_id",
    "questions": [
      {
        "_id": "question_id",
        "question": "Explain the difference between var, let, and const",
        "category": "technical",
        "difficulty": "medium"
      }
    ]
  }
}
```

### Submit Answer
```http
POST /api/interview/:sessionId/answer
```
🔒 Protected

**Request Body:**
```json
{
  "questionId": "question_id",
  "answer": "Your detailed answer here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 8,
    "feedback": "Good explanation...",
    "strengths": ["Clear understanding", "Good examples"],
    "improvements": ["Could mention more edge cases"]
  }
}
```

### Get Interview Session
```http
GET /api/interview/:sessionId
```
🔒 Protected

### Complete Interview
```http
POST /api/interview/:sessionId/complete
```
🔒 Protected

**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": 75,
    "feedback": {
      "overall": "You scored 75% overall. Good job!"
    },
    "questionsAnswered": 10,
    "totalQuestions": 10
  }
}
```

### Get Interview History
```http
GET /api/interview/history
```
🔒 Protected

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "interview_id",
      "sessionId": "session_id",
      "job": {
        "title": "Software Engineer",
        "company": "Tech Corp"
      },
      "overallScore": 75,
      "status": "completed",
      "createdAt": "2025-11-10T10:00:00.000Z"
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Header:** `X-RateLimit-Remaining` shows remaining requests

---

## Examples

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Jobs:**
```bash
curl http://localhost:5000/api/jobs?search=software&location=bangalore
```

**Generate Resume (with auth):**
```bash
curl -X POST http://localhost:5000/api/resume/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "jobId": "job_id_here",
    "githubUsername": "johndoe"
  }'
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Get jobs
const jobs = await api.get('/jobs', {
  params: { search: 'software', location: 'bangalore' }
});

// Generate resume
const resume = await api.post('/resume/generate', {
  jobId: 'job_id_here',
  githubUsername: 'johndoe'
});
```

---

## Webhooks (Future Feature)

Coming soon:
- Job scraping completion notifications
- Resume generation completion
- Interview completion notifications

---

For more information, visit the [GitHub Repository](https://github.com/yourusername/placemate)
