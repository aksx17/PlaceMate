import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiBriefcase, FiFileText, FiLayout, FiMessageSquare } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await jobsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Browse Jobs',
      description: 'Explore thousands of job opportunities',
      icon: <FiBriefcase className="w-8 h-8" />,
      link: '/jobs',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Generate Resume',
      description: 'Create AI-tailored resumes',
      icon: <FiFileText className="w-8 h-8" />,
      link: '/resume',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Build Portfolio',
      description: 'Create your professional portfolio',
      icon: <FiLayout className="w-8 h-8" />,
      link: '/portfolio',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Practice Interview',
      description: 'AI-powered mock interviews',
      icon: <FiMessageSquare className="w-8 h-8" />,
      link: '/interview',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your placement journey overview.</p>
        </div>

        {/* Stats */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  <FiBriefcase className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sources</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bySource.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} text-white mb-4`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Browse Jobs</h3>
                <p className="text-gray-600 dark:text-gray-300">Explore job listings from multiple platforms in one place.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Generate Tailored Resume</h3>
                <p className="text-gray-600 dark:text-gray-300">Let AI create a resume tailored to each job using your GitHub and LinkedIn.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Practice with AI Interviews</h3>
                <p className="text-gray-600 dark:text-gray-300">Prepare with AI-generated interview questions and get instant feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
