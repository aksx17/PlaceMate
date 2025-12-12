import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Resume from './pages/Resume';
import ResumeEdit from './pages/ResumeEdit';
import Portfolio from './pages/Portfolio';
import Interview from './pages/Interview';
import Dashboard from './pages/Dashboard';
import SkillGap from './pages/SkillGap';
import NetworkingHelper from './pages/NetworkingHelper';
import AlumniUpload from './pages/AlumniUpload';

// Import components
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Import store
import { useStore } from './store/useStore';

function App() {
  const { user, darkMode } = useStore();

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register />} 
          />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/resume/edit/:id" element={<ResumeEdit />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/skill-gap/:jobId" element={<SkillGap />} />
            <Route path="/networking" element={<NetworkingHelper />} />
            <Route path="/alumni-upload" element={<AlumniUpload />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </Router>
  );
}

export default App;
