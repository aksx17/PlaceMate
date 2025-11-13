import React, { useState, useEffect } from 'react';
import { resumeAPI, jobsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiDownload, FiEdit, FiPlus } from 'react-icons/fi';
import { useStore } from '../store/useStore';

const Resume = () => {
  const { user } = useStore();
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    jobId: '',
    githubUsername: user?.githubUsername || '',
    linkedinData: {}
  });

  useEffect(() => {
    fetchResumes();
    fetchJobs();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      setResumes(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getJobs({ limit: 50 });
      setJobs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch jobs');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.jobId) {
      toast.error('Please select a job');
      return;
    }

    setGenerating(true);
    try {
      await resumeAPI.generateResume(formData);
      toast.success('Resume generated successfully!');
      setShowModal(false);
      fetchResumes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate resume');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (resumeId) => {
    try {
      console.log('Downloading resume:', resumeId);
      toast.info('Generating PDF...');
      
      const response = await resumeAPI.downloadPDF(resumeId);
      console.log('PDF response:', response);
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${resumeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Resume downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.message || 'Failed to download resume');
    }
  };

  const handleEdit = (resumeId) => {
    // Navigate to edit page or open edit modal
    window.location.href = `/resume/edit/${resumeId}`;
    // Alternative: You could implement an edit modal similar to the generate modal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Resume Builder</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Generate tailored resumes for each job</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
          >
            <FiPlus className="mr-2" /> Generate Resume
          </button>
        </div>

        {/* Resume List */}
        {resumes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400">No resumes yet. Generate your first AI-tailored resume!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{resume.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Tailored for: {resume.tailoredFor?.jobTitle} at {resume.tailoredFor?.company}
                </p>
                <div className="mb-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    resume.aiGenerated ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {resume.aiGenerated ? 'AI Generated' : 'Manual'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(resume._id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-600"
                  >
                    <FiDownload className="mr-1" /> Download
                  </button>
                  <button 
                    onClick={() => handleEdit(resume._id)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="Edit Resume"
                  >
                    <FiEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate Resume Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Generate Resume</h2>
              <form onSubmit={handleGenerate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Job
                  </label>
                  <select
                    value={formData.jobId}
                    onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Choose a job...</option>
                    {jobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title} - {job.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={formData.githubUsername}
                    onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Your GitHub username"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating}
                    className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50"
                  >
                    {generating ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
