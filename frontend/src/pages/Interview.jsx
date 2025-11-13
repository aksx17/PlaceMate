import React, { useState, useEffect } from 'react';
import { interviewAPI, jobsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlay, FiClock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useStore } from '../store/useStore';

const Interview = () => {
  const { user } = useStore();
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobId: '',
    githubUsername: user?.githubUsername || '',
    difficulty: 'medium'
  });

  useEffect(() => {
    fetchJobs();
    fetchInterviewHistory();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getJobs({ limit: 50 });
      setJobs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch jobs');
    }
  };

  const fetchInterviewHistory = async () => {
    try {
      const response = await interviewAPI.getHistory();
      setInterviews(response.data.data);
    } catch (error) {
      console.error('Failed to fetch interview history');
    }
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!formData.jobId) {
      toast.error('Please select a job');
      return;
    }

    setLoading(true);
    try {
      const response = await interviewAPI.generateQuestions(formData);
      setCurrentInterview(response.data.data);
      setCurrentQuestionIndex(0);
      setShowModal(false);
      toast.success('Interview started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      const question = currentInterview.questions[currentQuestionIndex];
      await interviewAPI.submitAnswer(currentInterview.sessionId, {
        questionId: question._id,
        answer
      });

      toast.success('Answer submitted!');
      
      // Move to next question or complete
      if (currentQuestionIndex < currentInterview.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswer('');
        setShowAnswer(false); // Reset answer visibility for next question
      } else {
        handleCompleteInterview();
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  const handleCompleteInterview = async () => {
    try {
      const response = await interviewAPI.completeInterview(currentInterview.sessionId);
      toast.success(`Interview completed! Score: ${response.data.data.overallScore}%`);
      setCurrentInterview(null);
      setCurrentQuestionIndex(0);
      setAnswer('');
      fetchInterviewHistory();
    } catch (error) {
      toast.error('Failed to complete interview');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Mock Interview</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Practice with AI-powered interviews</p>
          </div>
          {!currentInterview && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
            >
              <FiPlay className="mr-2" /> Start Interview
            </button>
          )}
        </div>

        {currentInterview ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Question {currentQuestionIndex + 1} of {currentInterview.questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / currentInterview.questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / currentInterview.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 3D Avatar Placeholder */}
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-lg p-8 mb-6 text-center">
              <div className="w-48 h-48 mx-auto bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-6xl">🤖</div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300 italic">AI Avatar is asking you a question...</p>
            </div>

            {/* Question */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  currentInterview.questions[currentQuestionIndex].difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  currentInterview.questions[currentQuestionIndex].difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {currentInterview.questions[currentQuestionIndex].difficulty}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {currentInterview.questions[currentQuestionIndex].category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {currentInterview.questions[currentQuestionIndex].question}
              </h3>

              {/* Model Answer Section */}
              {currentInterview.questions[currentQuestionIndex].expectedAnswer && (
                <div className="mb-4 border border-primary-200 dark:border-primary-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 flex items-center justify-between text-left transition-colors"
                  >
                    <span className="font-medium text-primary-700 dark:text-primary-300 flex items-center">
                      {showAnswer ? <FiEyeOff className="mr-2" /> : <FiEye className="mr-2" />}
                      {showAnswer ? 'Hide Model Answer' : 'Show Model Answer'}
                    </span>
                    <span className="text-xs text-primary-600 dark:text-primary-400">Click to {showAnswer ? 'hide' : 'reveal'}</span>
                  </button>
                  {showAnswer && (
                    <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-primary-200 dark:border-primary-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentInterview.questions[currentQuestionIndex].expectedAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 min-h-[200px]"
                placeholder="Type your answer here..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to quit this interview?')) {
                    setCurrentInterview(null);
                    setCurrentQuestionIndex(0);
                    setAnswer('');
                    setShowAnswer(false);
                  }
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Quit Interview
              </button>
              <button
                onClick={handleSubmitAnswer}
                className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
              >
                {currentQuestionIndex < currentInterview.questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Interview History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Interview History</h2>
              {interviews.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">No interviews yet. Start your first mock interview!</p>
              ) : (
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div key={interview._id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{interview.job?.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{interview.job?.company}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center">
                              <FiClock className="mr-1" />
                              {new Date(interview.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              interview.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              interview.status === 'in-progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                        {interview.overallScore && (
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{interview.overallScore}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Start Interview Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Start Mock Interview</h2>
              <form onSubmit={handleStartInterview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Job *
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
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
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50"
                  >
                    {loading ? 'Starting...' : 'Start'}
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

export default Interview;
