# 🎓 PlaceMate - Quick Start Guide

## What You Have

A complete, production-ready full-stack MERN application with:

✅ **Backend (Node.js + Express)**
- MongoDB database integration
- JWT authentication
- 5 modular job scrapers (LinkedIn, Glassdoor, Naukri, Unstop, Indeed)
- Gemini AI integration for resume, portfolio, and interview features
- GitHub API integration
- RESTful API with full CRUD operations

✅ **Frontend (React + Tailwind CSS)**
- Modern, responsive UI
- State management with Zustand
- Protected routes
- Job browsing with filters
- AI resume generator
- AI portfolio builder
- AI mock interview system

✅ **Core Features**
1. Job Scraping & Aggregation from 5 platforms
2. AI Resume Tailoring (using Gemini + GitHub/LinkedIn data)
3. AI Portfolio Generator
4. AI Mock Interview with customized questions

---

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd "/home/adityaksx/Desktop/MINI PROJECT/PlaceMate"
npm run install-all
```

### 2. Set Up Environment Variables

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add:
- Your **Gemini API key** (Get from: https://makersuite.google.com/app/apikey)
- Your **GitHub token** (Get from: GitHub Settings → Developer settings → Tokens)
- Your **MongoDB connection string**

**Minimum required:**
```env
MONGODB_URI=mongodb://localhost:27017/placemate
JWT_SECRET=your_random_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
```

### 3. Start MongoDB
```bash
# If using local MongoDB
sudo systemctl start mongodb

# If using MongoDB Atlas, skip this step
```

### 4. Run the Application
```bash
npm run dev
```

This starts:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

### 5. Open Your Browser
Go to: http://localhost:3000

---

## 📋 First Steps After Launch

1. **Register an Account**
   - Click "Get Started"
   - Enter your details
   - **Important:** Add your GitHub username

2. **Scrape Some Jobs**
   - Go to Jobs page
   - Click "Scrape Jobs"
   - Wait 2-3 minutes

3. **Try the Features:**
   - Generate an AI-tailored resume
   - Create your portfolio
   - Take a mock interview

---

## 📁 Project Structure

```
PlaceMate/
├── backend/               # Node.js + Express API
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── controllers/      # Business logic
│   ├── services/         # External services (AI, scrapers)
│   │   ├── scrapers/    # Job scrapers for each platform
│   │   ├── geminiService.js
│   │   └── githubService.js
│   ├── middleware/       # Auth, validation, error handling
│   ├── config/          # Database connection
│   └── server.js        # Entry point
│
├── frontend/             # React + Tailwind UI
│   ├── src/
│   │   ├── pages/       # Main pages (Home, Jobs, Resume, etc.)
│   │   ├── components/  # Reusable UI components
│   │   ├── services/    # API calls
│   │   ├── store/       # State management (Zustand)
│   │   └── App.jsx      # Main app component
│   └── public/
│
├── package.json          # Root dependencies
├── README.md            # Project overview
├── SETUP_GUIDE.md       # Detailed setup instructions
└── API_DOCUMENTATION.md # API reference
```

---

## 🔑 Required API Keys

### 1. Gemini API Key (REQUIRED)
**Get it from:** https://makersuite.google.com/app/apikey

**Used for:**
- AI resume tailoring
- Portfolio content generation
- Interview question generation
- Answer evaluation

**You have:** Pro subscription ✅

### 2. GitHub Personal Access Token (REQUIRED)
**Get it from:** GitHub Settings → Developer settings → Personal access tokens

**Scopes needed:**
- `repo` (to read repositories)
- `user` (to read user profile)

**Used for:**
- Fetching user repositories
- Extracting tech stack and skills
- Getting project information

### 3. MongoDB Connection (REQUIRED)
**Option A:** Local MongoDB
```
mongodb://localhost:27017/placemate
```

**Option B:** MongoDB Atlas (Recommended)
```
mongodb+srv://username:password@cluster.mongodb.net/placemate
```

### 4. LinkedIn (OPTIONAL)
Currently using manual input. Can integrate LinkedIn API later.

---

## 🎯 How Each Feature Works

### 1. Job Scraping
- **What:** Scrapes jobs from 5 platforms simultaneously
- **How:** Uses Puppeteer (for dynamic sites) and Cheerio (for static HTML)
- **When:** On-demand or scheduled (every 6 hours)
- **Stores:** Job title, company, location, salary, tech stack, etc.

### 2. AI Resume Tailoring
- **Input:** User's GitHub + LinkedIn + Job description
- **Process:**
  1. Fetches user's GitHub repos and profile
  2. Extracts skills, projects, and technologies
  3. Sends to Gemini AI with job description
  4. AI generates tailored resume content
  5. Creates PDF using PDFKit
- **Output:** Professional, ATS-friendly resume PDF

### 3. AI Portfolio Generator
- **Input:** GitHub username + LinkedIn data
- **Process:**
  1. Fetches GitHub projects and stats
  2. AI generates professional headline and bio
  3. Categorizes skills
  4. Creates modern portfolio page
- **Output:** Shareable portfolio URL + downloadable HTML

### 4. AI Mock Interview
- **Input:** Job description + User's GitHub/LinkedIn
- **Process:**
  1. AI analyzes user's background and job requirements
  2. Generates 10 customized interview questions
  3. User answers each question
  4. AI evaluates answers and provides feedback
  5. Calculates overall score
- **Output:** Interview report with score and feedback

---

## 🛠️ Tech Stack Details

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **AI:** Google Gemini API
- **Scraping:** Puppeteer, Cheerio, Axios
- **PDF Generation:** PDFKit
- **Security:** Helmet, bcrypt, rate-limiting

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **State:** Zustand (lightweight state management)
- **HTTP Client:** Axios
- **3D Graphics:** Three.js (ready for avatar integration)
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Notifications:** React Toastify

---

## 🔧 Common Commands

```bash
# Install all dependencies
npm run install-all

# Run everything (backend + frontend)
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Check backend health
curl http://localhost:5000/health
```

---

## 📊 API Endpoints Summary

**Authentication:**
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get profile

**Jobs:**
- GET `/api/jobs` - List jobs (with filters)
- POST `/api/jobs/scrape` - Trigger scraping
- POST `/api/jobs/:id/save` - Save job
- POST `/api/jobs/:id/apply` - Apply to job

**Resume:**
- POST `/api/resume/generate` - Generate AI resume
- GET `/api/resume` - List resumes
- GET `/api/resume/:id/pdf` - Download PDF

**Portfolio:**
- POST `/api/portfolio/generate` - Generate portfolio
- GET `/api/portfolio/:userId` - View portfolio
- GET `/api/portfolio/:id/export` - Export HTML

**Interview:**
- POST `/api/interview/generate-questions` - Start interview
- POST `/api/interview/:sessionId/answer` - Submit answer
- POST `/api/interview/:sessionId/complete` - Finish interview

Full API docs: See `API_DOCUMENTATION.md`

---

## 🎨 Customization Ideas

### Easy Customizations:
1. **Colors/Theme:** Edit `frontend/tailwind.config.js`
2. **Add More Job Sites:** Create new scraper in `backend/services/scrapers/`
3. **Resume Templates:** Add templates in resume controller
4. **Portfolio Themes:** Modify portfolio HTML generator

### Advanced Features to Add:
1. **3D Avatar:** Integrate ReadyPlayerMe or custom Three.js avatar
2. **Email Notifications:** Add nodemailer for job alerts
3. **Analytics Dashboard:** Track application success rate
4. **Resume Builder UI:** Visual drag-drop resume builder
5. **LinkedIn OAuth:** Official LinkedIn integration
6. **Job Recommendations:** ML-based job matching
7. **Application Tracker:** Track application status
8. **Cover Letter Generator:** AI-powered cover letters

---

## 🐛 Troubleshooting

**MongoDB not connecting?**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Or start it
sudo systemctl start mongodb
```

**Port 5000 already in use?**
```bash
# Kill the process
lsof -ti:5000 | xargs kill -9
```

**Puppeteer installation failed?**
```bash
cd backend
npx puppeteer browsers install chrome
```

**React app won't start?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Performance Tips

1. **Job Scraping:** Run during off-peak hours
2. **Database:** Add indexes for frequently queried fields
3. **Caching:** Use Redis for job listings cache
4. **API Rate Limiting:** Already configured (100 req/15min)
5. **Production:** Use PM2 for process management

---

## 🔐 Security Checklist

✅ Passwords hashed with bcrypt
✅ JWT tokens for authentication
✅ Environment variables for secrets
✅ Input validation with express-validator
✅ Rate limiting enabled
✅ Helmet.js for security headers
✅ CORS configured

**Before Production:**
- [ ] Change JWT secret to strong random string
- [ ] Use HTTPS
- [ ] Enable MongoDB authentication
- [ ] Add request logging
- [ ] Set up monitoring (e.g., PM2, New Relic)

---

## 📚 Learning Resources

**Want to understand the code better?**
- Express.js: https://expressjs.com/
- React: https://react.dev/
- MongoDB: https://www.mongodb.com/docs/
- Gemini AI: https://ai.google.dev/docs
- Puppeteer: https://pptr.dev/

---

## 🚀 Deployment

### Backend
1. Use services like Render, Railway, or AWS
2. Set environment variables in hosting platform
3. Use PM2 for process management

### Frontend
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or serve from backend

### Database
- Use MongoDB Atlas (free tier available)

---

## 💡 Pro Tips

1. **Gemini API:** Monitor usage in Google AI Studio
2. **GitHub Token:** Keep it secret, rotate periodically
3. **Scraping:** Respect robots.txt and rate limits
4. **Testing:** Use Postman collection for API testing
5. **Version Control:** Commit `.env.example`, not `.env`

---

## 🎯 Next Steps

1. ✅ Set up environment variables
2. ✅ Run `npm run install-all`
3. ✅ Start the application
4. ✅ Create your account
5. ✅ Test each feature
6. 🔄 Customize to your needs
7. 🔄 Deploy to production
8. 🔄 Share with friends!

---

## 📞 Need Help?

Check these files:
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup
- `API_DOCUMENTATION.md` - API reference

---

**You're all set! Start building your placement success story with PlaceMate! 🎓🚀**
