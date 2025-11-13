import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // User state
      user: null,
      token: null,
      
      // Set user and token
      setAuth: (user, token) => set({ user, token }),
      
      // Logout
      logout: () => set({ user: null, token: null }),
      
      // Jobs state
      jobs: [],
      selectedJob: null,
      jobFilters: {
        search: '',
        location: '',
        jobType: '',
        techStack: []
      },
      
      setJobs: (jobs) => set({ jobs }),
      setSelectedJob: (job) => set({ selectedJob: job }),
      setJobFilters: (filters) => set({ jobFilters: filters }),
      
      // Resume state
      resumes: [],
      currentResume: null,
      
      setResumes: (resumes) => set({ resumes }),
      setCurrentResume: (resume) => set({ currentResume: resume }),
      
      // Portfolio state
      portfolio: null,
      
      setPortfolio: (portfolio) => set({ portfolio }),
      
      // Interview state
      interviews: [],
      currentInterview: null,
      
      setInterviews: (interviews) => set({ interviews }),
      setCurrentInterview: (interview) => set({ currentInterview: interview }),
      
      // Dark mode state
      darkMode: false,
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'placemate-storage',
      partialize: (state) => ({ user: state.user, token: state.token, darkMode: state.darkMode })
    }
  )
);
