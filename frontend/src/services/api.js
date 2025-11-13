import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  scrapeJobs: (data) => api.post('/jobs/scrape', data),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  applyToJob: (id) => api.post(`/jobs/${id}/apply`),
  getStats: () => api.get('/jobs/stats'),
};

// Resume API
export const resumeAPI = {
  generateResume: (data) => api.post('/resume/generate', data),
  getResumes: () => api.get('/resume'),
  getResume: (id) => api.get(`/resume/${id}`),
  updateResume: (id, data) => api.put(`/resume/${id}`, data),
  downloadPDF: (id) => api.get(`/resume/${id}/pdf`, { responseType: 'blob' }),
};

// Portfolio API
export const portfolioAPI = {
  generatePortfolio: (data) => api.post('/portfolio/generate', data),
  getPortfolio: (userId) => api.get(`/portfolio/${userId}`),
  updatePortfolio: (id, data) => api.put(`/portfolio/${id}`, data),
  togglePublish: (id) => api.patch(`/portfolio/${id}/publish`),
  exportPortfolio: (id) => api.get(`/portfolio/${id}/export`, { responseType: 'blob' }),
};

// Interview API
export const interviewAPI = {
  generateQuestions: (data) => api.post('/interview/generate-questions', data),
  submitAnswer: (sessionId, data) => api.post(`/interview/${sessionId}/answer`, data),
  getInterview: (sessionId) => api.get(`/interview/${sessionId}`),
  completeInterview: (sessionId) => api.post(`/interview/${sessionId}/complete`),
  getHistory: () => api.get('/interview/history'),
};

export default api;
