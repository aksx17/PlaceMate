import React, { useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiExternalLink, FiDownload } from 'react-icons/fi';
import { useStore } from '../store/useStore';

const Portfolio = () => {
  const { user } = useStore();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    githubUsername: user?.githubUsername || '',
    theme: 'modern'
  });

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio(user._id);
      setPortfolio(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch portfolio');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGenerate = async () => {
    if (!formData.githubUsername) {
      toast.error('Please enter your GitHub username');
      return;
    }

    setGenerating(true);
    try {
      const response = await portfolioAPI.generatePortfolio(formData);
      setPortfolio(response.data.data);
      toast.success('Portfolio generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate portfolio');
    } finally {
      setGenerating(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await portfolioAPI.togglePublish(portfolio._id);
      setPortfolio({ ...portfolio, published: !portfolio.published });
      toast.success(`Portfolio ${portfolio.published ? 'unpublished' : 'published'}!`);
    } catch (error) {
      toast.error('Failed to update portfolio status');
    }
  };

  const handleExport = async () => {
    try {
      const response = await portfolioAPI.exportPortfolio(portfolio._id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portfolio_${portfolio.customUrl}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Portfolio exported!');
    } catch (error) {
      toast.error('Failed to export portfolio');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Portfolio Generator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create a stunning portfolio from your GitHub and LinkedIn</p>
        </div>

        {!portfolio ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Generate Your Portfolio</h2>
            <div className="max-w-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Username *
                </label>
                <input
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Your GitHub username"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="creative">Creative</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Portfolio'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Portfolio Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{portfolio.content.about.headline}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{portfolio.content.about.bio}</p>
                  <div className="mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      portfolio.published ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {portfolio.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTogglePublish}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {portfolio.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                  >
                    <FiDownload className="mr-2" /> Export
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Skills</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.content.skills?.slice(0, 3).map((skillCat, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{skillCat.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillCat.items.slice(0, 5).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Featured Projects</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {portfolio.content.projects?.filter(p => p.featured).map((project, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies?.slice(0, 4).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm flex items-center"
                        >
                          <FiExternalLink className="mr-1" /> View on GitHub
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Portfolio Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolio.views}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolio.content.projects?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolio.content.skills?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Skill Categories</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
