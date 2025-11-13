# 🚀 PlaceMate Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

## Required API Keys

You'll need the following API keys:

1. **Gemini API Key** (Required)
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key //AIzaSyCt_4HwqL3jtDOP1V9dWytdHjhi-wQoOvI

2. **GitHub Personal Access Token** (Required)
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` and `user`
   - Generate and copy the token 

3. **MongoDB Connection String** (Required)
   - **Option A: Local MongoDB**
     - Install MongoDB locally
     - Connection string: `mongodb://localhost:27017/placemate`
   
   - **Option B: MongoDB Atlas (Recommended)**
     - Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Create a cluster
     - Click "Connect" → "Connect your application"
     - Copy connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/placemate`)

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd "/home/adityaksx/Desktop/MINI PROJECT/PlaceMate"
```

### Step 2: Install All Dependencies

```bash
# Install root, backend, and frontend dependencies
npm run install-all
```

This will install dependencies for:
- Root project (concurrently)
- Backend (Express, MongoDB, AI services, scrapers)
- Frontend (React, Tailwind, Three.js)

### Step 3: Configure Backend Environment

```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit the .env file
nano backend/.env  # or use your preferred editor
```

**Update the following in `backend/.env`:**

```env
# Server
PORT=5000
NODE_ENV=development

# Database - IMPORTANT: Update this!
MONGODB_URI=mongodb://localhost:27017/placemate
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/placemate

# JWT Secret - CHANGE THIS!
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_make_it_long_and_random
JWT_EXPIRE=7d //2bc461b5c1d12d8d410728fae92196e5c1276df5304db525e36184025bc0616834ab56d0e27fef8e15480992a237054eb09c6331458913b1a8ff9da5eb342ec4

# Gemini AI - REQUIRED!
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# GitHub - REQUIRED!
GITHUB_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN

# LinkedIn (optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id //86q9jclo9sht8x
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret //WPL_AP1.RL4e5R9y9J556bX0.8BsN/g==

# CORS
CORS_ORIGIN=http://localhost:3000
```

**🔒 Security Note:** Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Configure Frontend Environment

```bash
# Copy example env file
cp frontend/.env.example frontend/.env

# Edit if needed (default values should work)
```

The frontend `.env` file should contain:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
sudo systemctl start mongodb
# or
mongod
```

**Option B: MongoDB Atlas**
- No action needed - it's already running in the cloud!

### Step 6: Start the Application

**Option 1: Run Everything at Once (Recommended for Development)**
```bash
# From project root
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000) concurrently.

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Step 7: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## First Time Setup

1. **Create an Account**
   - Go to http://localhost:3000
   - Click "Get Started" or "Register"
   - Fill in your details
   - **Important:** Add your GitHub username for best experience

2. **Scrape Jobs**
   - Navigate to "Jobs" page
   - Click "Scrape Jobs" button
   - Wait a few minutes for jobs to be scraped

3. **Generate Resume**
   - Go to "Resume" page
   - Click "Generate Resume"
   - Select a job
   - Enter your GitHub username
   - Wait for AI to generate your resume

4. **Build Portfolio**
   - Go to "Portfolio" page
   - Enter your GitHub username
   - Select a theme
   - Click "Generate Portfolio"

5. **Practice Interview**
   - Go to "Interview" page
   - Click "Start Interview"
   - Select a job
   - Answer the AI-generated questions

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check connection string in `.env`
- For Atlas: Whitelist your IP in MongoDB Atlas dashboard

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
# or use a different port in backend/.env
PORT=5001
```

### Puppeteer Installation Issues

**Error:** Chromium download fails

**Solution:**
```bash
cd backend
npx puppeteer browsers install chrome
```

### Gemini API Errors

**Error:** `API key not valid`

**Solution:**
- Verify your API key is correct in `backend/.env`
- Ensure there are no extra spaces
- Check if API key has required permissions

### React Build Errors

**Error:** Module not found

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Testing the API

You can test the API endpoints using curl or Postman:

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "githubUsername": "octocat"
  }'
```

### Get Jobs
```bash
curl http://localhost:5000/api/jobs
```

## Development Tips

### Watch Logs
```bash
# Backend logs
cd backend && npm run dev

# The nodemon will auto-restart on file changes
```

### Clear Database
```bash
# Connect to MongoDB
mongosh

# Use the database
use placemate

# Drop collections
db.jobs.drop()
db.users.drop()
db.resumes.drop()
```

### Run Scrapers Manually
```bash
# In backend directory, create a test script
node -e "
const scraper = require('./services/scrapers/scraperOrchestrator');
scraper.scrapeAll().then(console.log);
"
```

## Production Deployment

### Backend (Node.js)

1. Set environment to production:
```env
NODE_ENV=production
```

2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

### Frontend (React)

```bash
cd frontend
npm run build
```

Serve the `build` folder using:
- Nginx
- Apache
- Vercel
- Netlify

### Environment Variables for Production

- Update `CORS_ORIGIN` to your production frontend URL
- Use strong `JWT_SECRET`
- Use MongoDB Atlas for database
- Enable rate limiting
- Add HTTPS

## Additional Features to Implement

### 3D Avatar Integration (Advanced)

For a real 3D avatar in interviews:

1. **Option A: ReadyPlayerMe**
```bash
npm install @readyplayerme/react-avatar-creator
```

2. **Option B: Three.js Custom Avatar**
- Already included in dependencies
- Implement in `frontend/src/components/interview/Avatar3D.jsx`

### LinkedIn Data Extraction

Since LinkedIn doesn't provide easy API access:

1. **Option A: Manual Input**
   - Users paste LinkedIn profile data

2. **Option B: RapidAPI**
   - Use LinkedIn scraper from RapidAPI
   - Add API key to `.env`

3. **Option C: Browser Extension**
   - Create extension to extract data
   - User authorizes and shares data

## Need Help?

Common commands:

```bash
# Restart everything
npm run dev

# Check backend logs
cd backend && npm run dev

# Check for errors
npm run server 2>&1 | tee backend.log

# Update dependencies
npm run install-all
```

## Success Checklist

- [ ] MongoDB running
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Gemini API key configured
- [ ] GitHub token configured
- [ ] Can register new user
- [ ] Can scrape jobs
- [ ] Can generate resume
- [ ] Can create portfolio
- [ ] Can start mock interview

## Next Steps

1. Customize the UI/UX to your liking
2. Add more job sites to scrapers
3. Implement 3D avatar for interviews
4. Add email notifications
5. Implement user dashboard analytics
6. Add resume templates
7. Integrate payment for premium features

Enjoy using PlaceMate! 🎓🚀
