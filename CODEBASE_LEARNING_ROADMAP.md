# 🎯 PlaceMate Codebase Learning Roadmap
## For Java/C++ Developers New to MERN Stack

---

## 🚀 Overview: What You're About to Learn

**PlaceMate** is a full-stack web application built with:
- **M**ongoDB - Database (like MySQL but NoSQL)
- **E**xpress - Backend framework (like Spring Boot but simpler)
- **R**eact - Frontend library (builds UI)
- **N**ode.js - JavaScript runtime (runs JS on server)

**Think of it like this (Java comparison):**
- Node.js/Express = Spring Boot (backend server)
- MongoDB = MySQL/PostgreSQL (but document-based, not tables)
- React = JSP/Servlets (but way more powerful for UI)
- npm = Maven/Gradle (package manager)

---

## 📚 PHASE 0: Prerequisites (1-2 hours)

### Step 1: Understand JavaScript Basics
**What you MUST know before diving in:**

#### 1. **Variables & Data Types**
```javascript
// Java:                      // JavaScript:
int age = 25;                 let age = 25;           // mutable
final String name = "John";   const name = "John";    // immutable
boolean isActive = true;      const isActive = true;
```

#### 2. **Functions**
```javascript
// Java:
public String greet(String name) {
    return "Hello " + name;
}

// JavaScript (multiple ways):
function greet(name) {
    return "Hello " + name;
}

// Arrow function (modern way):
const greet = (name) => {
    return "Hello " + name;
};

// Even shorter:
const greet = (name) => "Hello " + name;
```

#### 3. **Objects (like Java classes but simpler)**
```javascript
// Java:
class User {
    String name;
    int age;
}
User user = new User();
user.name = "John";

// JavaScript:
const user = {
    name: "John",
    age: 25,
    greet: function() {
        return `Hi, I'm ${this.name}`;
    }
};
console.log(user.name);  // "John"
```

#### 4. **Arrays**
```javascript
// Java:
String[] fruits = {"apple", "banana"};

// JavaScript:
const fruits = ["apple", "banana"];
fruits.push("orange");  // add to end
fruits.map(fruit => fruit.toUpperCase());  // ["APPLE", "BANANA", "ORANGE"]
```

#### 5. **Promises & Async/Await (CRITICAL for Node.js)**
```javascript
// Think of Promises like CompletableFuture in Java

// Old way (callbacks):
fetchUser(id, function(user) {
    console.log(user);
});

// Promise way:
fetchUser(id)
    .then(user => console.log(user))
    .catch(error => console.log(error));

// Modern way (async/await) - looks like synchronous code:
async function getUser(id) {
    try {
        const user = await fetchUser(id);  // waits for result
        console.log(user);
    } catch (error) {
        console.log(error);
    }
}
```

#### 6. **Import/Export (like Java imports)**
```javascript
// Java:
import com.example.User;

// JavaScript (ES6 modules):
import { User } from './models/User.js';
export const greet = (name) => "Hello " + name;

// Node.js (CommonJS - what PlaceMate uses):
const User = require('./models/User');
module.exports = { greet };
```

---

## 🗺️ PHASE 1: Understanding the Big Picture (30 minutes)

### The Request-Response Flow

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Browser   │ ──────► │   Backend   │ ──────► │   MongoDB    │
│  (React)    │  HTTP   │ (Node.js)   │  Query  │  (Database)  │
│             │ ◄────── │             │ ◄────── │              │
└─────────────┘  JSON   └─────────────┘  Data   └──────────────┘
```

**Example Flow (Login):**
1. User types email/password in **React form** (frontend)
2. React sends HTTP POST request to **backend API** at `/api/auth/login`
3. **Express router** receives request, calls **authController.login()**
4. Controller queries **MongoDB** to find user
5. If found, generates **JWT token**, sends back to React
6. React stores token in **localStorage**, user is logged in

---

## 🎯 PHASE 2: Start with Backend (Database → Models → Routes → Controllers)

### Why Backend First?
Backend is the "brain" - it's easier to understand the data flow, and it's more similar to Java/C++ logic.

---

## 📦 STEP 1: Understanding MongoDB (30 minutes)

### Location: `backend/config/database.js`

**Read this file first:**
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/config/database.js
```

**What it does:**
```javascript
const mongoose = require('mongoose');  // ORM like Hibernate in Java

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
```

**Key Concepts:**

#### 1. **MongoDB vs SQL (Java comparison)**
```
SQL (MySQL):                    MongoDB:
-----------------               -----------------
Database = "placemate"          Database = "placemate"
Table = "users"                 Collection = "users"
Row = User record               Document = User object
Column = user fields            Field = user properties

SQL: SELECT * FROM users        MongoDB: db.users.find({})
     WHERE email='a@b.com';              .where({email: 'a@b.com'})
```

#### 2. **Connection String**
```javascript
// Local MongoDB:
mongodb://localhost:27017/placemate

// MongoDB Atlas (cloud):
mongodb+srv://username:password@cluster.mongodb.net/placemate
```

**To view database with MongoDB Compass:**
1. Open MongoDB Compass
2. Paste connection string: `mongodb://localhost:27017/placemate`
3. Click "Connect"
4. You'll see collections: `users`, `jobs`, `resumes`, `portfolios`, `interviews`

---

## 📋 STEP 2: Models (Data Structures) - START HERE! (1 hour)

### Location: `backend/models/`

**Models define the "schema" (structure) of data - like Java classes with annotations.**

### Read in this order:

#### 1. **User.js** - Most Important First
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/models/User.js
```

**What to understand:**
```javascript
const mongoose = require('mongoose');

// Think of this like @Entity in Java JPA
const userSchema = new mongoose.Schema({
  name: {
    type: String,              // like: String name;
    required: true,            // like: @NotNull
    trim: true                 // removes whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,              // like: @Column(unique=true)
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false              // won't be returned in queries by default
  },
  skills: [String],            // Array of strings
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,  // Foreign key
    ref: 'Job'                             // References Job model
  }]
}, {
  timestamps: true            // Auto adds createdAt, updatedAt
});

// Middleware (like @PrePersist in Java)
userSchema.pre('save', async function(next) {
  // Hash password before saving
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Export (like public class User)
module.exports = mongoose.model('User', userSchema);
```

**Key Concepts:**
- `Schema` = Blueprint for data (like class definition)
- `Model` = Compiled schema (like class instance)
- `pre('save')` = Hook that runs before saving (like lifecycle methods)
- `ObjectId` = MongoDB's auto-generated ID (like auto-increment primary key)
- `ref` = Foreign key relationship

#### 2. **Job.js** - Second Most Important
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/models/Job.js
```

**Look for:**
- How job data is structured
- What fields are required
- Indexing for fast searches

#### 3. **Resume.js, Portfolio.js, Interview.js**
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/models/Resume.js
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/models/Portfolio.js
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/models/Interview.js
```

**Questions to answer while reading:**
- What data does each model store?
- How are they related to User model?
- What validations are applied?

---

## 🛣️ STEP 3: Routes (URL Mapping) (30 minutes)

### Location: `backend/routes/`

**Routes map URLs to controller functions - like @RequestMapping in Spring Boot.**

### Read in this order:

#### 1. **auth.js** - Authentication Routes
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/routes/auth.js
```

**What to understand:**
```javascript
const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Java equivalent: @PostMapping("/register")
router.post('/register', register);

// Java: @PostMapping("/login")
router.post('/login', login);

// Java: @GetMapping("/profile"), with @PreAuthorize
router.get('/profile', protect, getProfile);  // protect = authentication middleware

module.exports = router;
```

**Route breakdown:**
```
POST /api/auth/register  → register()   → Create new user
POST /api/auth/login     → login()      → Authenticate user
GET  /api/auth/profile   → getProfile() → Get user data (protected)
```

**Middleware (`protect`):**
- Runs BEFORE controller
- Checks if JWT token is valid
- Like Spring Security's @PreAuthorize

#### 2. **Other Routes**
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/routes/jobs.js
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/routes/resume.js
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/routes/portfolio.js
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/routes/interview.js
```

**Map them out:**
```
Jobs Routes:
GET    /api/jobs          → Get all jobs
GET    /api/jobs/:id      → Get single job
POST   /api/jobs/scrape   → Trigger scraping

Resume Routes:
POST   /api/resume/generate → Create resume
GET    /api/resume          → Get all resumes
GET    /api/resume/:id/pdf  → Download PDF

Portfolio Routes:
POST   /api/portfolio/generate → Generate portfolio
GET    /api/portfolio          → Get user's portfolio

Interview Routes:
POST   /api/interview/generate → Generate questions
POST   /api/interview/submit   → Submit answers
GET    /api/interview/history  → Get past interviews
```

---

## 🎮 STEP 4: Controllers (Business Logic) (2 hours)

### Location: `backend/controllers/`

**Controllers handle requests, call services, return responses - like @RestController in Spring Boot.**

### Read in this order:

#### 1. **authController.js** - Start Here!
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/controllers/authController.js
```

**What to understand:**
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;  // Get data from request
    
    // Check if user exists (like repository.findByEmail())
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user (like repository.save())
    const user = await User.create({ name, email, password });
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Send response (like ResponseEntity.ok())
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user (select password field explicitly)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords (bcrypt.compare())
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token & send response
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Key Concepts:**
- `req` = Request object (contains data from client)
- `res` = Response object (send data back to client)
- `async/await` = Handle database operations (which are asynchronous)
- `try/catch` = Error handling
- `res.json()` = Send JSON response
- `res.status()` = Set HTTP status code

**Common Status Codes:**
```
200 - OK (success)
201 - Created (resource created successfully)
400 - Bad Request (validation error)
401 - Unauthorized (authentication failed)
404 - Not Found
500 - Internal Server Error
```

#### 2. **jobController.js** - Job Management
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/controllers/jobController.js
```

**Focus on:**
- How jobs are fetched from database
- Filtering logic (location, role, etc.)
- Pagination (page, limit)
- How scraping is triggered

#### 3. **resumeController.js** - AI Resume Generation
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/controllers/resumeController.js
```

**Focus on:**
- How GitHub data is fetched
- How Gemini AI is called
- How PDF is generated
- CRUD operations (Create, Read, Update, Delete)

#### 4. **interviewController.js** - AI Interview
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/controllers/interviewController.js
```

**Focus on:**
- How questions are generated
- How answers are evaluated
- Session management

---

## 🔧 STEP 5: Services (External Integrations) (1.5 hours)

### Location: `backend/services/`

**Services handle complex operations - like Service layer in Spring Boot.**

### Read in this order:

#### 1. **geminiService.js** - AI Integration (MOST IMPORTANT!)
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/services/geminiService.js
```

**What to understand:**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Generate interview questions
exports.generateInterviewQuestions = async (jobData, githubData) => {
  // Create prompt (instructions for AI)
  const prompt = `
    Generate 10 interview questions for:
    Job Role: ${jobData.title}
    Company: ${jobData.company}
    Requirements: ${jobData.requirements}
    
    Candidate's GitHub Repos: ${githubData.repos}
    Skills: ${githubData.skills}
    
    For each question, provide:
    1. Question text
    2. Difficulty (Easy/Medium/Hard)
    3. Category (Technical/Behavioral/System Design)
    4. Expected answer (3-5 sentences)
    5. Key points to cover
    
    Return as JSON array.
  `;
  
  // Call AI API
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse JSON response
  const questions = JSON.parse(text);
  return questions;
};
```

**Key Concepts:**
- **Prompt Engineering** = How you ask AI matters!
- AI returns text, we parse it to JSON
- Error handling is crucial (AI can fail)

#### 2. **githubService.js** - GitHub API Integration
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/services/githubService.js
```

**Focus on:**
- How GitHub API is called
- How repo data is fetched
- How languages/stats are analyzed

#### 3. **scrapers/** - Web Scraping (ADVANCED)
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/services/scrapers/scraperOrchestrator.js
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/services/scrapers/linkedinScraper.js
```

**What to understand:**
```javascript
const puppeteer = require('puppeteer');

// Scrape LinkedIn jobs
exports.scrapeLinkedIn = async (query) => {
  // Launch headless browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to LinkedIn
  await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${query}`);
  
  // Wait for jobs to load
  await page.waitForSelector('.job-card');
  
  // Extract job data
  const jobs = await page.evaluate(() => {
    const jobCards = document.querySelectorAll('.job-card');
    return Array.from(jobCards).map(card => ({
      title: card.querySelector('.job-title').innerText,
      company: card.querySelector('.company-name').innerText,
      location: card.querySelector('.location').innerText,
      link: card.querySelector('a').href
    }));
  });
  
  await browser.close();
  return jobs;
};
```

**Key Concepts:**
- Puppeteer = Controls Chrome browser programmatically
- `page.evaluate()` = Runs code in browser context
- `querySelector()` = Like document.getElementById() in Java/Selenium

---

## 🛡️ STEP 6: Middleware (Guards & Validators) (30 minutes)

### Location: `backend/middleware/`

**Middleware = Functions that run BEFORE controllers - like Filters/Interceptors in Java.**

#### 1. **auth.js** - Authentication Middleware
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/middleware/auth.js
```

**What to understand:**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes (verify JWT token)
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    req.user = await User.findById(decoded.id);
    
    next();  // Continue to controller
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
```

**Flow:**
```
Request → protect middleware → Check token → Add user to req → Controller
                ↓ (if token invalid)
              401 Unauthorized
```

#### 2. **validator.js** - Input Validation
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/middleware/validator.js
```

**Focus on:**
- How user input is validated
- Preventing SQL injection, XSS attacks

---

## 🖥️ STEP 7: Main Server File (Entry Point) (20 minutes)

### Location: `backend/server.js`

**This is where everything starts - like main() method in Java.**

```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/backend/server.js
```

**What to understand:**
```javascript
const express = require('express');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(cors());         // Enable CORS

// Routes
app.use('/api/auth', authRoutes);      // All /api/auth/* go to authRoutes
app.use('/api/jobs', jobRoutes);       // All /api/jobs/* go to jobRoutes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Key Concepts:**
- `express()` = Create server instance
- `app.use()` = Register middleware/routes
- `app.listen()` = Start listening for requests
- Routes are prefixed: `/api/auth` + `/login` = `/api/auth/login`

---

## 🎨 PHASE 3: Frontend (React) (3-4 hours)

### Why Frontend After Backend?
You now understand the data flow. Frontend just consumes the APIs you learned about.

---

## ⚛️ STEP 8: React Basics (1 hour)

### Understanding React (vs Java Swing/JavaFX)

**Java Swing:**
```java
JFrame frame = new JFrame("My App");
JButton button = new JButton("Click Me");
button.addActionListener(e -> System.out.println("Clicked"));
frame.add(button);
```

**React:**
```javascript
function MyApp() {
  const handleClick = () => console.log("Clicked");
  
  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}
```

**Key Concepts:**

#### 1. **JSX (JavaScript XML)**
```javascript
// Looks like HTML but it's JavaScript
const element = <h1>Hello World</h1>;

// Can embed JavaScript with {}
const name = "John";
const element = <h1>Hello {name}</h1>;

// Can use expressions
const element = <h1>2 + 2 = {2 + 2}</h1>;  // Shows "2 + 2 = 4"
```

#### 2. **Components (like classes but functional)**
```javascript
// A component is a function that returns JSX
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Use it:
<Welcome name="John" />
```

#### 3. **State (data that can change)**
```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // [variable, setter]
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Think of state like:**
```java
// Java:
private int count = 0;
public void increment() {
    count++;
    repaint();  // Update UI
}

// React:
const [count, setCount] = useState(0);
setCount(count + 1);  // Auto re-renders UI
```

#### 4. **Props (passing data)**
```javascript
// Like function parameters
function UserCard({ name, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

// Use it:
<UserCard name="John" email="john@example.com" />
```

#### 5. **useEffect (lifecycle hooks)**
```javascript
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Runs when component mounts (like componentDidMount in Java)
    console.log("Component loaded");
    
    // Fetch data from API
    fetchData();
    
    // Cleanup (like componentWillUnmount)
    return () => {
      console.log("Component unloaded");
    };
  }, []);  // Empty array = run once on mount
}
```

---

## 🚦 STEP 9: Frontend Entry Point (30 minutes)

### Location: `frontend/src/`

#### 1. **index.js** - Entry Point
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/index.js
```

**What it does:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mount React app to HTML element with id="root"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 2. **App.jsx** - Main Component
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/App.jsx
```

**What to understand:**
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Routing:**
```
URL                    Component Rendered
/                   →  <Home />
/login              →  <Login />
/dashboard          →  <Dashboard />
/jobs               →  <Jobs />
```

---

## 📄 STEP 10: Pages (UI Components) (2 hours)

### Location: `frontend/src/pages/`

**Read in this order:**

#### 1. **Login.jsx** - Start Here!
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/pages/Login.jsx
```

**What to understand:**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    
    try {
      // Call backend API
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Key Concepts:**
- `useState` = Store form data
- `axios.post()` = Send HTTP request to backend
- `localStorage` = Store token in browser
- `navigate()` = Redirect to another page

#### 2. **Register.jsx** - User Registration
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/pages/Register.jsx
```

#### 3. **Dashboard.jsx** - Main Dashboard
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/pages/Dashboard.jsx
```

**Focus on:**
- How data is fetched on page load
- useEffect for API calls
- Displaying user stats

#### 4. **Jobs.jsx** - Job Listings
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/pages/Jobs.jsx
```

**Focus on:**
- Fetching jobs from API
- Filtering logic
- Pagination

#### 5. **Resume.jsx** - Resume Management
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/pages/Resume.jsx
```

**Focus on:**
- How resume generation is triggered
- Modal/form handling
- PDF download

#### 6. **Interview.jsx** - AI Interview (MOST COMPLEX!)
```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/pages/Interview.jsx
```

**Focus on:**
- State management (current question, answers)
- Three.js integration (3D avatar)
- Answer submission flow

---

## 🗄️ STEP 11: State Management (Zustand) (30 minutes)

### Location: `frontend/src/store/useStore.js`

```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/store/useStore.js
```

**What to understand:**
```javascript
import create from 'zustand';

// Global state (accessible from any component)
const useStore = create((set) => ({
  // State
  user: null,
  jobs: [],
  darkMode: false,
  
  // Actions (functions to update state)
  setUser: (user) => set({ user }),
  setJobs: (jobs) => set({ jobs }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode }))
}));

export default useStore;

// Use in components:
function MyComponent() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  
  useEffect(() => {
    setUser({ name: 'John', email: 'john@example.com' });
  }, []);
  
  return <h1>Welcome, {user?.name}</h1>;
}
```

**Think of it like:**
```java
// Java Singleton pattern
public class AppState {
    private static AppState instance;
    private User user;
    
    public static AppState getInstance() {
        if (instance == null) instance = new AppState();
        return instance;
    }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}

// React Zustand:
const user = useStore(state => state.user);
const setUser = useStore(state => state.setUser);
```

---

## 🌐 STEP 12: API Service (HTTP Calls) (20 minutes)

### Location: `frontend/src/services/api.js`

```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/src/services/api.js
```

**What to understand:**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile')
};

// Jobs API
export const jobsAPI = {
  getAll: (filters) => api.get('/jobs', { params: filters }),
  getById: (id) => api.get(`/jobs/${id}`),
  scrape: () => api.post('/jobs/scrape')
};

// Use in components:
import { authAPI } from '../services/api';

const handleLogin = async () => {
  const response = await authAPI.login(email, password);
  console.log(response.data);
};
```

---

## 🎨 STEP 13: Styling (Tailwind CSS) (20 minutes)

### Location: `frontend/tailwind.config.js`

```bash
/home/adityaksx/Desktop/MINI PROJECT/PlaceMate/frontend/tailwind.config.js
```

**Tailwind = Utility-first CSS (no separate CSS files needed)**

**Traditional CSS:**
```css
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
```

**Tailwind CSS:**
```javascript
<button className="bg-blue-500 text-white px-5 py-2 rounded">
  Click Me
</button>
```

**Common Tailwind Classes:**
```
bg-blue-500     = background blue
text-white      = white text
px-4            = padding-x: 1rem
py-2            = padding-y: 0.5rem
rounded         = border-radius
shadow-lg       = box shadow
flex            = display: flex
grid            = display: grid
dark:bg-gray-900 = dark mode background
```

---

## 🧩 PHASE 4: How Everything Connects (1 hour)

### Complete Flow Example: Creating a Resume

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ACTION                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Generate Resume" in Resume.jsx              │
│    - Fills form: GitHub username, selects job              │
│    - Clicks "Generate with AI"                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend (Resume.jsx)                                    │
│    const handleGenerate = async () => {                     │
│      const response = await axios.post(                     │
│        '/api/resume/generate',                              │
│        { githubUsername, jobId }                            │
│      );                                                      │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend Router (routes/resume.js)                        │
│    router.post('/generate', protect, generateResume);       │
│    - "protect" middleware checks JWT token                  │
│    - Calls generateResume() controller                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Controller (controllers/resumeController.js)             │
│    exports.generateResume = async (req, res) => {           │
│      // 1. Get GitHub data                                  │
│      const githubData = await githubService.getUserData();  │
│                                                              │
│      // 2. Get job description                              │
│      const job = await Job.findById(jobId);                 │
│                                                              │
│      // 3. Call Gemini AI                                   │
│      const resumeContent = await geminiService              │
│        .generateResume(githubData, job);                    │
│                                                              │
│      // 4. Save to database                                 │
│      const resume = await Resume.create({                   │
│        userId: req.user._id,                                │
│        content: resumeContent                               │
│      });                                                     │
│                                                              │
│      // 5. Generate PDF                                     │
│      const pdfUrl = await generatePDF(resume);              │
│                                                              │
│      // 6. Send response                                    │
│      res.json({ success: true, resume, pdfUrl });           │
│    };                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Service (services/githubService.js)                      │
│    exports.getUserData = async (username) => {              │
│      const response = await axios.get(                      │
│        `https://api.github.com/users/${username}/repos`     │
│      );                                                      │
│      return response.data;                                  │
│    };                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Service (services/geminiService.js)                      │
│    exports.generateResume = async (githubData, job) => {    │
│      const prompt = `Create resume for:                     │
│        GitHub: ${githubData}                                │
│        Job: ${job.description}`;                            │
│                                                              │
│      const result = await model.generateContent(prompt);    │
│      return result.response.text();                         │
│    };                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Database (MongoDB)                                       │
│    - New resume document created in "resumes" collection    │
│    - Linked to user via userId ObjectId                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Response Back to Frontend                                │
│    { success: true, resume: {...}, pdfUrl: "..." }          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend Updates UI                                      │
│    - Shows success message                                  │
│    - Displays resume preview                                │
│    - Enables "Download PDF" button                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 PHASE 5: Practice & Deep Dive (2-3 hours)

### Exercises to Master the Codebase

#### Exercise 1: Trace a Complete Flow
**Task:** Trace the login flow from button click to database query.

**Steps:**
1. Open `frontend/src/pages/Login.jsx`
2. Find the `handleSubmit` function
3. Follow the API call to `backend/routes/auth.js`
4. Find the controller in `backend/controllers/authController.js`
5. See how it queries `User` model
6. Understand JWT token generation
7. See how token is sent back and stored

#### Exercise 2: Add a New API Endpoint
**Task:** Add a "Get User Stats" endpoint.

**Steps:**
1. Add route in `backend/routes/auth.js`:
   ```javascript
   router.get('/stats', protect, getUserStats);
   ```
2. Add controller function in `authController.js`:
   ```javascript
   exports.getUserStats = async (req, res) => {
     const resumeCount = await Resume.countDocuments({ userId: req.user._id });
     const interviewCount = await Interview.countDocuments({ userId: req.user._id });
     res.json({ resumeCount, interviewCount });
   };
   ```
3. Call from frontend in Dashboard.jsx

#### Exercise 3: Modify UI
**Task:** Add a "Favorite Jobs" feature.

**Steps:**
1. Add `favoriteJobs` array to User model
2. Create API endpoint to toggle favorite
3. Add heart icon to job cards
4. Update state when clicked
5. Filter jobs by favorites

---

## 🗺️ Visual Roadmap Summary

```
DAY 1 (4-5 hours):
├── Phase 0: JavaScript Basics (1-2 hours)
├── Phase 1: Big Picture (30 min)
└── Phase 2: Backend Deep Dive
    ├── Step 1: MongoDB (30 min)
    ├── Step 2: Models (1 hour)
    ├── Step 3: Routes (30 min)
    └── Step 4: Controllers (2 hours)

DAY 2 (4-5 hours):
├── Phase 2 (continued):
│   ├── Step 5: Services (1.5 hours)
│   ├── Step 6: Middleware (30 min)
│   └── Step 7: Server.js (20 min)
└── Phase 3: Frontend
    ├── Step 8: React Basics (1 hour)
    └── Step 9: Frontend Entry (30 min)

DAY 3 (3-4 hours):
├── Phase 3 (continued):
│   ├── Step 10: Pages (2 hours)
│   ├── Step 11: State Management (30 min)
│   ├── Step 12: API Service (20 min)
│   └── Step 13: Styling (20 min)
├── Phase 4: How Everything Connects (1 hour)
└── Phase 5: Practice Exercises (2-3 hours)
```

---

## 🎯 Priority Reading Order (If Short on Time)

**MUST READ (2-3 hours):**
1. `backend/models/User.js` - Understand data structure
2. `backend/routes/auth.js` - See URL mappings
3. `backend/controllers/authController.js` - Business logic
4. `backend/server.js` - Entry point
5. `frontend/src/App.jsx` - Frontend entry
6. `frontend/src/pages/Login.jsx` - Simple page example
7. `frontend/src/pages/Dashboard.jsx` - Complex page example

**SHOULD READ (2 hours):**
1. `backend/services/geminiService.js` - AI integration
2. `backend/services/githubService.js` - API calls
3. `backend/middleware/auth.js` - Authentication
4. `frontend/src/store/useStore.js` - State management
5. `frontend/src/services/api.js` - HTTP calls

**NICE TO READ (1-2 hours):**
1. Scraper files - Web scraping logic
2. Other page components - UI patterns
3. Job/Resume/Portfolio controllers

---

## 🔧 Quick Setup to Explore Live

### 1. MongoDB Connection String
Open MongoDB Compass and connect with:
```
mongodb://localhost:27017/placemate
```

Or check your `.env` file:
```bash
cat /home/adityaksx/Desktop/MINI\ PROJECT/PlaceMate/backend/.env
```

### 2. Run the Project
```bash
# Terminal 1 - Backend
cd /home/adityaksx/Desktop/MINI\ PROJECT/PlaceMate/backend
npm install
npm start

# Terminal 2 - Frontend
cd /home/adityaksx/Desktop/MINI\ PROJECT/PlaceMate/frontend
npm install
npm start
```

### 3. Test APIs with Postman/Thunder Client
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123"
}
```

---

## 📖 Recommended Learning Resources

### JavaScript/Node.js
1. **MDN Web Docs** - https://developer.mozilla.org/en-US/docs/Web/JavaScript
2. **JavaScript.info** - https://javascript.info/
3. **Node.js Docs** - https://nodejs.org/docs/

### React
1. **Official React Docs** - https://react.dev/
2. **React Tutorial** - https://react.dev/learn

### MongoDB
1. **MongoDB University** (Free) - https://university.mongodb.com/
2. **Mongoose Docs** - https://mongoosejs.com/docs/

### MERN Stack
1. **FreeCodeCamp MERN Tutorial** - YouTube
2. **Traversy Media** - YouTube channel

---

## 💡 Tips for Java/C++ Developers

### Key Differences to Remember:

1. **No Semicolons Required** (but recommended)
2. **Dynamic Typing** (no `int`, `String`, etc.)
3. **Asynchronous by Default** (use `async/await`)
4. **No Classes Needed** (use functions)
5. **Arrow Functions** (like lambdas but simpler)
6. **Destructuring** (extract values easily)
7. **JSON Everywhere** (no serialization needed)

### Mental Model Mappings:

| Java/C++          | JavaScript/Node.js |
|-------------------|--------------------|
| Spring Boot       | Express.js         |
| Hibernate/JPA     | Mongoose           |
| @RestController   | router + controller |
| @Autowired        | require() / import |
| application.properties | .env file    |
| Maven/Gradle      | npm                |
| JUnit             | Jest/Mocha         |

---

## 🚀 You're Ready!

Follow this roadmap step by step. Don't rush. Take breaks. Code along as you read. By Day 3, you'll understand the entire codebase and be able to explain it confidently!

**Start with:** `backend/models/User.js` RIGHT NOW! 🎯

Good luck! 🔥
