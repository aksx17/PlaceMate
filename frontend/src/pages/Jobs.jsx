import React, { useEffect, useState } from 'react';
import { jobsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiBookmark, FiExternalLink, FiRefreshCw } from 'react-icons/fi';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    source: ''
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.getJobs({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      setJobs(response.data.data);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await jobsAPI.scrapeJobs({ source: 'all' });
      toast.success('Job scraping started! This may take a few minutes.');
      setTimeout(fetchJobs, 5000);
    } catch (error) {
      toast.error('Failed to start scraping');
    } finally {
      setScraping(false);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      await jobsAPI.saveJob(jobId);
      toast.success('Job saved!');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Listings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Browse jobs from multiple platforms</p>
          </div>
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${scraping ? 'animate-spin' : ''}`} />
            {scraping ? 'Scraping...' : 'Scrape Jobs'}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
            <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Sources</option>
              <option value="linkedin">LinkedIn</option>
              <option value="glassdoor">Glassdoor</option>
              <option value="naukri">Naukri</option>
              <option value="unstop">Unstop</option>
              <option value="indeed">Indeed</option>
            </select>
          </div>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400">No jobs found. Try adjusting your filters or scrape new jobs.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{job.title}</h3>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">{job.company}</p>
                      </div>
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-medium rounded-full">
                        {job.source}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {job.location && (
                        <span className="flex items-center">
                          <FiMapPin className="mr-1" /> {job.location}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="flex items-center">
                          <FiBriefcase className="mr-1" /> {job.jobType}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center">
                          <FiDollarSign className="mr-1" /> 
                          {job.salary.min && job.salary.max 
                            ? `₹${job.salary.min/100000}L - ₹${job.salary.max/100000}L`
                            : 'Not disclosed'
                          }
                        </span>
                      )}
                      {job.postedDate && (
                        <span className="flex items-center">
                          <FiClock className="mr-1" /> 
                          {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                    {job.techStack && job.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.techStack.slice(0, 5).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleSaveJob(job._id)}
                        className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <FiBookmark className="mr-1" /> Save
                      </button>
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <FiExternalLink className="mr-1" /> Apply
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-900 dark:text-white">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
