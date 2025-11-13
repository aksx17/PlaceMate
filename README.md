# 🎓 PlaceMate - AI-Powered Placement Companion

PlaceMate is a comprehensive full-stack application that acts as your personal companion during placements and job applications. It automates job discovery, resume tailoring, portfolio generation, and interview preparation using AI and data from your GitHub and LinkedIn profiles.

## 🚀 Features

### 1. **Job Scraping & Aggregation**
- Scrapes job listings from LinkedIn, Glassdoor, Naukri, Unstop, and Indeed
- Interactive job cards with detailed information
- Advanced filters: location, role, company, tech stack
- Modular scraper architecture for easy maintenance

### 2. **AI-Powered Mock Interview with 3D Avatar**
- Analyzes your GitHub repos, LinkedIn profile, and job descriptions
- Generates customized interview questions using Gemini AI
- Interactive 3D avatar (Three.js/ReadyPlayerMe) conducts the interview
- Real-time feedback and answer evaluation

### 3. **AI Resume Tailoring**
- Dynamically creates tailored resumes for each job
- Extracts skills from GitHub and LinkedIn
- Matches keywords from job descriptions
- Professional PDF export with editing capabilities

### 4. **AI Portfolio Generator**
- Automatically generates a modern portfolio website
- Pulls data from GitHub repos and LinkedIn profile
- Showcases projects, skills, certifications, and experience
- Shareable URL + downloadable HTML/CSS version

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Three.js / @react-three/fiber** - 3D avatar rendering
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - API calls

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Puppeteer** - Web scraping
- **Cheerio** - HTML parsing

### AI & APIs
- **Google Gemini API** - AI-powered features
- **GitHub API** - Fetch user repositories
- **LinkedIn API / Scrapers** - Fetch profile data
- **ReadyPlayerMe API** - 3D avatars (optional)

### Utilities
- **PDFKit** - PDF generation
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **node-cron** - Scheduled scraping

## 📁 Project Structure

```
PlaceMate/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Resume.js
│   │   └── Portfolio.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── resume.js
│   │   ├── portfolio.js
│   │   └── interview.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── resumeController.js
│   │   ├── portfolioController.js
│   │   └── interviewController.js
│   ├── services/
│   │   ├── scrapers/
│   │   │   ├── linkedinScraper.js
│   │   │   ├── glassdoorScraper.js
│   │   │   ├── naukriScraper.js
│   │   │   ├── unstopScraper.js
│   │   │   ├── indeedScraper.js
│   │   │   └── scraperOrchestrator.js
│   │   ├── geminiService.js
│   │   ├── githubService.js
│   │   ├── linkedinService.js
│   │   ├── resumeService.js
│   │   └── portfolioService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── utils/
│   │   ├── pdfGenerator.js
│   │   └── helpers.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── jobs/
│   │   │   ├── resume/
│   │   │   ├── portfolio/
│   │   │   └── interview/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Resume.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── useStore.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Gemini API Key (Pro subscription)
- GitHub Personal Access Token
- LinkedIn API credentials (optional)

### Step 1: Clone and Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

### Step 2: Configure Environment Variables

#### Backend (.env)
Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/placemate
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placemate

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub
GITHUB_TOKEN=your_github_personal_access_token

# LinkedIn (optional - if using official API)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# ReadyPlayerMe (optional)
READY_PLAYER_ME_API_KEY=your_rpm_api_key

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_READY_PLAYER_ME_SUBDOMAIN=your_subdomain
```

### Step 3: Run the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Backend (on port 5000)
npm run server

# Frontend (on port 3000)
npm run client
```

### Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs/scrape` - Trigger job scraping
- `GET /api/jobs/filter` - Filter jobs by criteria

### Resume
- `POST /api/resume/generate` - Generate tailored resume
- `GET /api/resume/:id` - Get resume
- `PUT /api/resume/:id` - Update resume
- `GET /api/resume/:id/pdf` - Download resume PDF

### Portfolio
- `POST /api/portfolio/generate` - Generate portfolio
- `GET /api/portfolio/:userId` - Get user portfolio
- `GET /api/portfolio/:userId/export` - Export portfolio HTML

### Interview
- `POST /api/interview/generate-questions` - Generate interview questions
- `POST /api/interview/evaluate-answer` - Evaluate user answer
- `GET /api/interview/:sessionId` - Get interview session

## 🔑 Getting API Keys

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into `.env`

### GitHub Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` and `user` scopes
3. Copy and paste into `.env`

### LinkedIn (Optional)
- For official API: Apply for LinkedIn Developer Program
- Alternative: Use third-party scrapers or RapidAPI

## 🎨 Features in Detail

### Job Scraping
- Uses Puppeteer for dynamic content
- Implements rate limiting and proxy rotation
- Scheduled scraping with node-cron
- Error handling and retry mechanisms

### AI Resume Tailoring
- Analyzes job description for keywords
- Matches user skills from GitHub/LinkedIn
- Generates ATS-friendly format
- Allows manual editing before export

### Portfolio Generator
- Responsive design templates
- Dark/light mode support
- Project showcase with images
- Skills visualization
- Contact form integration

### Mock Interview
- 3D avatar with lip-sync (optional)
- Speech-to-text for answers
- AI evaluation with feedback
- Difficulty progression
- Interview history tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for students navigating their placement journey.

---

**Note:** This is a feature-rich application. Start with core features and gradually add advanced functionalities like 3D avatars and portfolio generation.
