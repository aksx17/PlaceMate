# 🗺️ PlaceMate - Quick Reference Guide

## 📊 MongoDB Compass Setup

### How to Access Your Database

#### Step 1: Get Connection String
```bash
# Check your .env file
cd /home/adityaksx/Desktop/MINI\ PROJECT/PlaceMate/backend
cat .env

# Look for this line:
# MONGODB_URI=mongodb://localhost:27017/placemate
```

#### Step 2: Open MongoDB Compass
1. Launch MongoDB Compass application
2. You'll see a connection string field

#### Step 3: Connect
**For Local MongoDB:**
```
mongodb://localhost:27017/placemate
```

**For MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/placemate
```

Click **"Connect"**

#### Step 4: Explore Collections
You'll see 5 collections:
- **users** - User accounts
- **jobs** - Scraped job listings
- **resumes** - Generated resumes
- **portfolios** - User portfolios
- **interviews** - Interview sessions

---

## 📁 Folder Structure Explained

```
PlaceMate/
│
├── backend/                          # Server-side code (Node.js)
│   ├── server.js                     # ⭐ START HERE - Entry point
│   ├── package.json                  # Dependencies list
│   ├── .env                          # Secret keys (DON'T commit)
│   │
│   ├── config/
│   │   └── database.js               # MongoDB connection setup
│   │
│   ├── models/                       # 📦 Database Schemas (Data Structure)
│   │   ├── User.js                   # ⭐ READ FIRST - User data structure
│   │   ├── Job.js                    # Job listing schema
│   │   ├── Resume.js                 # Resume data structure
│   │   ├── Portfolio.js              # Portfolio schema
│   │   └── Interview.js              # Interview session schema
│   │
│   ├── routes/                       # 🛣️ URL Mappings (Which URL goes where)
│   │   ├── auth.js                   # ⭐ READ SECOND - /api/auth/*
│   │   ├── jobs.js                   # /api/jobs/*
│   │   ├── resume.js                 # /api/resume/*
│   │   ├── portfolio.js              # /api/portfolio/*
│   │   └── interview.js              # /api/interview/*
│   │
│   ├── controllers/                  # 🎮 Business Logic (What happens)
│   │   ├── authController.js         # ⭐ READ THIRD - Login, Register logic
│   │   ├── jobController.js          # Job operations
│   │   ├── resumeController.js       # Resume generation
│   │   ├── portfolioController.js    # Portfolio creation
│   │   └── interviewController.js    # Interview AI logic
│   │
│   ├── services/                     # 🔧 External Services
│   │   ├── geminiService.js          # ⭐ AI Integration (Google Gemini)
│   │   ├── githubService.js          # GitHub API calls
│   │   └── scrapers/                 # Web Scraping
│   │       ├── scraperOrchestrator.js # Manages all scrapers
│   │       ├── linkedinScraper.js    # Scrapes LinkedIn
│   │       ├── glassdoorScraper.js   # Scrapes Glassdoor
│   │       ├── naukriScraper.js      # Scrapes Naukri
│   │       ├── unstopScraper.js      # Scrapes Unstop
│   │       └── indeedScraper.js      # Scrapes Indeed
│   │
│   └── middleware/                   # 🛡️ Guards (Run before controllers)
│       ├── auth.js                   # JWT token verification
│       ├── errorHandler.js           # Error handling
│       └── validator.js              # Input validation
│
├── frontend/                         # Client-side code (React)
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind CSS config
│   │
│   ├── public/
│   │   └── index.html                # Base HTML file
│   │
│   └── src/
│       ├── index.js                  # ⭐ Frontend Entry Point
│       ├── App.jsx                   # ⭐ Main Component (Routing)
│       ├── index.css                 # Global styles
│       │
│       ├── pages/                    # 📄 Main Pages (Routes)
│       │   ├── Home.jsx              # Landing page (/)
│       │   ├── Login.jsx             # ⭐ READ FIRST - Login page (/login)
│       │   ├── Register.jsx          # Register page (/register)
│       │   ├── Dashboard.jsx         # ⭐ READ SECOND - Dashboard (/dashboard)
│       │   ├── Jobs.jsx              # Job listings (/jobs)
│       │   ├── Resume.jsx            # Resume management (/resume)
│       │   ├── Portfolio.jsx         # Portfolio generator (/portfolio)
│       │   └── Interview.jsx         # AI Interview (/interview)
│       │
│       ├── components/               # 🧩 Reusable Components
│       │   └── common/
│       │       ├── Navbar.jsx        # Navigation bar
│       │       └── PrivateRoute.jsx  # Protected route wrapper
│       │
│       ├── services/                 # 🌐 API Calls
│       │   └── api.js                # ⭐ Axios HTTP client setup
│       │
│       └── store/                    # 💾 State Management
│           └── useStore.js           # Zustand global state
│
├── Documentation Files
│   ├── README.md                     # Project overview
│   ├── SETUP_GUIDE.md                # How to install
│   ├── API_DOCUMENTATION.md          # API reference
│   ├── PROJECT_SUMMARY.md            # Feature summary
│   └── CODEBASE_LEARNING_ROADMAP.md  # This guide!
│
└── Setup Scripts
    ├── setup.sh                      # Linux/Mac setup
    └── setup.bat                     # Windows setup
```

---

## 🔄 Request Flow Diagram

### Example: User Login

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (React)                         │
│  User clicks "Login" button in Login.jsx                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST /api/auth/login
                             │ Body: { email, password }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Node.js/Express)                   │
│                                                                  │
│  1. server.js receives request                                  │
│     ↓                                                            │
│  2. Routes to /api/auth → routes/auth.js                        │
│     ↓                                                            │
│  3. POST /login → authController.login()                        │
│     ↓                                                            │
│  4. authController.js:                                           │
│     - Query MongoDB for user (models/User.js)                   │
│     - Verify password (bcrypt.compare)                          │
│     - Generate JWT token (jsonwebtoken)                         │
│     - Send response                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Response: { success: true, token }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (React)                         │
│  - Save token to localStorage                                   │
│  - Redirect to /dashboard                                       │
│  - Show success message                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Files to Understand

### Backend (Priority Order)

| File | Purpose | Read Order |
|------|---------|-----------|
| `backend/models/User.js` | User data structure | ⭐ 1st |
| `backend/routes/auth.js` | URL mappings for auth | ⭐ 2nd |
| `backend/controllers/authController.js` | Login/register logic | ⭐ 3rd |
| `backend/server.js` | Main entry point | ⭐ 4th |
| `backend/services/geminiService.js` | AI integration | 5th |
| `backend/middleware/auth.js` | JWT verification | 6th |
| `backend/config/database.js` | MongoDB setup | 7th |

### Frontend (Priority Order)

| File | Purpose | Read Order |
|------|---------|-----------|
| `frontend/src/index.js` | Entry point | ⭐ 1st |
| `frontend/src/App.jsx` | Main component + routing | ⭐ 2nd |
| `frontend/src/pages/Login.jsx` | Simple page example | ⭐ 3rd |
| `frontend/src/pages/Dashboard.jsx` | Complex page example | ⭐ 4th |
| `frontend/src/services/api.js` | API calls setup | 5th |
| `frontend/src/store/useStore.js` | Global state | 6th |

---

## 🔑 Environment Variables

### Backend `.env` File

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/placemate

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# GitHub
GITHUB_TOKEN=your_github_token

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env` File

```bash
REACT_APP_API_URL=http://localhost:5000
```

---

## 📡 All API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register         # Create new user
POST   /api/auth/login            # Login user
GET    /api/auth/profile          # Get user profile (protected)
PUT    /api/auth/profile          # Update profile (protected)
POST   /api/auth/validate-github  # Validate GitHub username
```

### Jobs (`/api/jobs`)
```
GET    /api/jobs                  # Get all jobs (with filters)
GET    /api/jobs/:id              # Get single job
POST   /api/jobs/scrape           # Trigger scraping (protected)
POST   /api/jobs/:id/save         # Save job (protected)
DELETE /api/jobs/:id/save         # Unsave job (protected)
```

### Resume (`/api/resume`)
```
POST   /api/resume/generate       # Generate AI resume (protected)
GET    /api/resume                # Get all user resumes (protected)
GET    /api/resume/:id            # Get single resume (protected)
PUT    /api/resume/:id            # Update resume (protected)
DELETE /api/resume/:id            # Delete resume (protected)
GET    /api/resume/:id/pdf        # Download PDF (protected)
```

### Portfolio (`/api/portfolio`)
```
POST   /api/portfolio/generate    # Generate portfolio (protected)
GET    /api/portfolio             # Get user portfolio (protected)
PUT    /api/portfolio             # Update portfolio (protected)
POST   /api/portfolio/publish     # Toggle publish status (protected)
GET    /api/portfolio/:username   # Get public portfolio
```

### Interview (`/api/interview`)
```
POST   /api/interview/generate    # Generate questions (protected)
POST   /api/interview/submit      # Submit answers (protected)
GET    /api/interview/history     # Get interview history (protected)
GET    /api/interview/:id         # Get specific interview (protected)
DELETE /api/interview/:id         # Delete interview (protected)
```

---

## 🧪 Test API with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🎨 Frontend Routes

```
/                    → Home.jsx          (Landing page)
/login               → Login.jsx         (Login form)
/register            → Register.jsx      (Registration form)
/dashboard           → Dashboard.jsx     (Main dashboard) [Protected]
/jobs                → Jobs.jsx          (Job listings) [Protected]
/resume              → Resume.jsx        (Resume management) [Protected]
/portfolio           → Portfolio.jsx     (Portfolio generator) [Protected]
/interview           → Interview.jsx     (AI Interview) [Protected]
```

**Protected Routes** = Requires login (JWT token)

---

## 🗃️ MongoDB Collections Structure

### users
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$hashed...",  // bcrypt hashed
  githubUsername: "johndoe",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  skills: ["JavaScript", "React", "Node.js"],
  savedJobs: [ObjectId("..."), ObjectId("...")],
  createdAt: ISODate("2025-01-01T00:00:00Z"),
  updatedAt: ISODate("2025-01-01T00:00:00Z")
}
```

### jobs
```javascript
{
  _id: ObjectId("..."),
  title: "Software Engineer",
  company: "Google",
  location: "Bangalore",
  salary: "₹15-20 LPA",
  description: "...",
  requirements: ["Python", "ML", "AWS"],
  source: "linkedin",
  url: "https://...",
  postedDate: ISODate("2025-01-01"),
  scrapedAt: ISODate("2025-01-01T00:00:00Z")
}
```

### resumes
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  jobId: ObjectId("..."),
  personalInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91-1234567890"
  },
  skills: ["React", "Node.js"],
  projects: [{
    name: "E-commerce App",
    tech: ["React", "MongoDB"],
    description: "...",
    github: "https://github.com/..."
  }],
  pdfUrl: "/uploads/resume_123.pdf",
  createdAt: ISODate("...")
}
```

### interviews
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  jobId: ObjectId("..."),
  questions: [{
    question: "Explain React hooks",
    difficulty: "Medium",
    category: "Technical",
    expectedAnswer: "React hooks are...",
    keyPoints: ["useState", "useEffect"],
    userAnswer: "Hooks allow...",
    score: 8
  }],
  overallScore: 75,
  feedback: "Good understanding of hooks",
  completedAt: ISODate("...")
}
```

---

## 🚀 Quick Commands

### Start Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### View Logs
```bash
# Backend logs
cd backend
npm start

# Look for:
# "MongoDB Connected"
# "Server running on port 5000"
```

### Check MongoDB
```bash
# Using MongoDB Compass: Connect to mongodb://localhost:27017/placemate
# Or using CLI:
mongosh
use placemate
show collections
db.users.find().pretty()
```

---

## 📚 Learning Checklist

### Day 1 - Backend Basics
- [ ] Read `backend/models/User.js`
- [ ] Read `backend/routes/auth.js`
- [ ] Read `backend/controllers/authController.js`
- [ ] Read `backend/server.js`
- [ ] Understand JWT authentication flow
- [ ] Connect to MongoDB with Compass

### Day 2 - Backend Advanced
- [ ] Read `backend/services/geminiService.js`
- [ ] Read `backend/services/githubService.js`
- [ ] Understand scraper orchestrator
- [ ] Read middleware files
- [ ] Test APIs with Postman/cURL

### Day 3 - Frontend
- [ ] Read `frontend/src/index.js`
- [ ] Read `frontend/src/App.jsx`
- [ ] Read `frontend/src/pages/Login.jsx`
- [ ] Read `frontend/src/pages/Dashboard.jsx`
- [ ] Understand state management (Zustand)
- [ ] Test app in browser

### Day 4 - Integration
- [ ] Trace login flow end-to-end
- [ ] Trace resume generation flow
- [ ] Understand interview AI logic
- [ ] Modify a feature
- [ ] Add new endpoint

---

## 🎯 Your First Task

**Start Here (30 minutes):**

1. Open `backend/models/User.js`
2. Read every line with comments
3. Understand the schema structure
4. Open MongoDB Compass
5. Connect to your database
6. Click on "users" collection
7. See the actual data structure
8. Compare with User.js schema

**Then move to:**
- `backend/routes/auth.js` (10 min)
- `backend/controllers/authController.js` (30 min)

**You're on your way! 🚀**
