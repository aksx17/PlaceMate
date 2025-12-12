import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SkillGap = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [job, setJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [githubUsername, setGithubUsername] = useState('');
  const [uploadedResumeId, setUploadedResumeId] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch existing analysis if available
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        // Fetch job details
        const jobResponse = await api.get(`/jobs/${jobId}`);
        setJob(jobResponse.data.data);

        // Try to fetch existing analysis
        try {
          const analysisResponse = await api.get(`/skill-gap/job/${jobId}`);
          setAnalysis(analysisResponse.data.data);
        } catch (err) {
          // No existing analysis found - that's ok
          console.log('No existing analysis found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [jobId]);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('title', `Resume for ${job?.title || 'Job'}`);

      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedResumeId(response.data.data.resumeId);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    }
  };

  // Analyze skill gap
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError('');

      const requestData = {
        jobId: jobId,
        githubUsername: githubUsername || undefined,
        resumeId: uploadedResumeId || undefined
      };

      const response = await api.post('/skill-gap/analyze', requestData);
      setAnalysis(response.data.data);
      setActiveTab('overview');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze skill gap');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Skill Gap Analyzer</h1>
        {job && (
          <p className="text-gray-600 mt-2">
            {job.title} at {job.company}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Input Section */}
      {!analysis && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Your Information</h2>
          
          {/* Resume Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (PDF or DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {resumeFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {resumeFile.name} uploaded
              </p>
            )}
          </div>

          {/* GitHub Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Username 
            </label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="e.g., octocat"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              We'll analyze your repositories to identify additional skills
            </p>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing || (!uploadedResumeId && !githubUsername)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {analyzing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Skill Gap'
            )}
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'skills', 'courses', 'study-plan', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Match Score */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Match Score</h3>
                <div className="flex items-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - (analysis.analysis.matchScore || 0) / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{analysis.analysis.matchScore}%</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <p className="text-gray-600">
                      {analysis.analysis.matchScore >= 80 ? 'Excellent match!' : 
                       analysis.analysis.matchScore >= 60 ? 'Good match with some gaps to fill' :
                       'Several skills need development'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Matching Skills */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600">
                  ✓ Skills You Have ({analysis.analysis.matchingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis.matchingSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">
                  ✗ Skills You Need ({analysis.analysis.missingSkills?.length || 0})
                </h3>
                <div className="space-y-2">
                  {analysis.analysis.missingSkills?.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className="ml-2 text-sm text-gray-600">({skill.category})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          skill.priority === 'high' ? 'bg-red-200 text-red-800' :
                          skill.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {skill.priority} priority
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          skill.importance === 'required' ? 'bg-red-200 text-red-800' :
                          skill.importance === 'preferred' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {skill.importance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Your Skills</h3>
              <div className="space-y-4">
                {analysis.analysis.userSkills?.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({skill.proficiencyLevel || 'intermediate'})
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      skill.source === 'both' ? 'bg-purple-200 text-purple-800' :
                      skill.source === 'github' ? 'bg-blue-200 text-blue-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {skill.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Recommended Courses</h3>
              {analysis.analysis.recommendations?.courses?.map((course, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Platform: {course.platform} | Duration: {course.duration}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">Skill: {course.skill}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {course.isPaid && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          Paid
                        </span>
                      )}
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View Course
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <h3 className="text-lg font-semibold mb-4 mt-8">YouTube Resources</h3>
              {analysis.analysis.recommendations?.videos?.map((video, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{video.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Channel: {video.channel} | Duration: {video.duration}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">Skill: {video.skill}</p>
                    </div>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Study Plan Tab */}
          {activeTab === 'study-plan' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Your Personalized Study Plan</h3>
              <p className="text-gray-600 mb-6">
                Total Duration: {analysis.analysis.recommendations?.studyPlan?.totalDuration || 'N/A'}
              </p>
              
              <div className="space-y-6">
                {analysis.analysis.recommendations?.studyPlan?.phases?.map((phase, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                        {phase.phase}
                      </span>
                      <div>
                        <h4 className="text-lg font-semibold">{phase.title}</h4>
                        <p className="text-sm text-gray-600">{phase.duration}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{phase.description}</p>
                    
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Skills to learn:</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills?.map((skill, skillIdx) => (
                          <span key={skillIdx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Milestones:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {phase.milestones?.map((milestone, milestoneIdx) => (
                          <li key={milestoneIdx}>{milestone}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Projects to Build</h3>
              {analysis.analysis.recommendations?.projects?.map((project, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      project.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Skills Covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skillsCovered?.map((skill, skillIdx) => (
                        <span key={skillIdx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, techIdx) => (
                        <span key={techIdx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Key Features:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {project.keyFeatures?.map((feature, featureIdx) => (
                        <li key={featureIdx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Estimated Time: {project.estimatedTime}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Re-analyze Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setAnalysis(null);
                setResumeFile(null);
                setUploadedResumeId(null);
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Run New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGap;
