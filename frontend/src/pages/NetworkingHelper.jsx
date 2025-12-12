import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { FiSearch, FiLinkedin, FiGithub, FiMail, FiGlobe, FiMapPin, FiAward, FiUsers, FiMessageSquare, FiCopy, FiCheckCircle } from 'react-icons/fi';

const NetworkingHelper = () => {
  const [searchParams] = useSearchParams();
  
  const [searching, setSearching] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [generatedMessages, setGeneratedMessages] = useState(null);
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('contacts');
  const [strategy, setStrategy] = useState(null);
  
  const [searchCriteria, setSearchCriteria] = useState({
    targetRole: searchParams.get('role') || '',
    targetCompany: searchParams.get('company') || '',
    institution: 'Shri Mata Vaishno Devi University',
    department: 'CSE' // Default to CSE
  });

  const [error, setError] = useState('');

  // Search for contacts
  const handleSearch = async () => {
    if (!searchCriteria.targetRole && !searchCriteria.targetCompany) {
      setError('Please enter at least role or company');
      return;
    }

    try {
      setSearching(true);
      setError('');
      
      const response = await api.post('/networking/find-contacts', {
        targetRole: searchCriteria.targetRole,
        targetCompany: searchCriteria.targetCompany,
        institution: searchCriteria.institution,
        department: searchCriteria.department
      });

      setContacts(response.data.data.contacts);
      setActiveTab('contacts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to find contacts');
    } finally {
      setSearching(false);
    }
  };

  // Generate networking message
  const handleGenerateMessage = async (contact, purpose = 'referral') => {
    try {
      setGeneratingMessage(true);
      
      const response = await api.post('/networking/generate-message', {
        contactId: contact._id,
        purpose: purpose,
        customContext: {
          targetRole: searchCriteria.targetRole
        }
      });

      setGeneratedMessages(response.data.data);
      setActiveTab('message');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate message');
    } finally {
      setGeneratingMessage(false);
    }
  };

  // Get networking strategy
  const handleGetStrategy = async () => {
    try {
      const response = await api.post('/networking/strategy', {
        targetRole: searchCriteria.targetRole,
        targetCompany: searchCriteria.targetCompany
      });

      setStrategy(response.data.data);
      setActiveTab('strategy');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get strategy');
    }
  };

  // Copy message to clipboard
  const copyToClipboard = (text, messageType) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(messageType);
    setTimeout(() => setCopiedMessage(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Networking Helper</h1>
        <p className="text-gray-600">
          Find alumni and professionals at your target companies and get personalized connection messages
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Find SMVDU CSE Alumni</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Role *
            </label>
            <input
              type="text"
              value={searchCriteria.targetRole}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, targetRole: e.target.value })}
              placeholder="e.g., Software Engineer, Data Scientist"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Company *
            </label>
            <input
              type="text"
              value={searchCriteria.targetCompany}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, targetCompany: e.target.value })}
              placeholder="e.g., Google, Microsoft, Amazon"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={searchCriteria.department}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="CSE">Computer Science & Engineering</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="EE">Electrical Engineering</option>
              <option value="All">All Departments</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution
            </label>
            <input
              type="text"
              value={searchCriteria.institution}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <FiSearch className="mr-2" />
            {searching ? 'Searching...' : 'Find Alumni'}
          </button>

          <button
            onClick={handleGetStrategy}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center"
          >
            <FiUsers className="mr-2" />
            Get Networking Strategy
          </button>
        </div>
      </div>

      {/* Tabs */}
      {contacts.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['contacts', 'message', 'strategy'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && contacts.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">Found {contacts.length} professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  {contact.profilePicture ? (
                    <img
                      src={contact.profilePicture}
                      alt={contact.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {contact.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.currentRole}</p>
                    <p className="text-sm text-blue-600 font-medium">{contact.company}</p>
                  </div>

                  {contact.relevanceScore && (
                    <div className="ml-2">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                        {contact.relevanceScore}% Match
                      </div>
                    </div>
                  )}
                </div>

                {contact.location && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FiMapPin className="mr-1" />
                    {contact.location}
                  </div>
                )}

                {contact.bio && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{contact.bio}</p>
                )}

                {/* Skills */}
                {contact.skills && contact.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {contact.skills.slice(0, 3).map((skill, skillIdx) => (
                        <span key={skillIdx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {contact.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{contact.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Links */}
                <div className="flex items-center gap-3 mb-4">
                  {contact.contactLinks?.linkedin && (
                    <a
                      href={contact.contactLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiLinkedin size={20} />
                    </a>
                  )}
                  {contact.contactLinks?.github && (
                    <a
                      href={contact.contactLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <FiGithub size={20} />
                    </a>
                  )}
                  {contact.contactLinks?.email && (
                    <a
                      href={`mailto:${contact.contactLinks.email}`}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiMail size={20} />
                    </a>
                  )}
                  {contact.contactLinks?.portfolio && (
                    <a
                      href={contact.contactLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiGlobe size={20} />
                    </a>
                  )}
                </div>

                {/* Alumni Badge */}
                {contact.isAlumni && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                      <FiAward className="mr-1" />
                      Alumni
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleGenerateMessage(contact)}
                  disabled={generatingMessage}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
                >
                  <FiMessageSquare className="mr-2" />
                  {generatingMessage ? 'Generating...' : 'Generate Message'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Tab */}
      {activeTab === 'message' && generatedMessages && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Connection Messages for {generatedMessages.contactInfo.name}</h2>
          
          {/* Short Message */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">LinkedIn Connection Request</h3>
              <button
                onClick={() => copyToClipboard(generatedMessages.shortMessage, 'short')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                {copiedMessage === 'short' ? (
                  <>
                    <FiCheckCircle className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{generatedMessages.shortMessage}</p>
            </div>
          </div>

          {/* Medium Message */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">LinkedIn Direct Message</h3>
              <button
                onClick={() => copyToClipboard(generatedMessages.mediumMessage, 'medium')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                {copiedMessage === 'medium' ? (
                  <>
                    <FiCheckCircle className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{generatedMessages.mediumMessage}</p>
            </div>
          </div>

          {/* Detailed Message */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Email Message</h3>
              <button
                onClick={() => copyToClipboard(`Subject: ${generatedMessages.subject}\n\n${generatedMessages.detailedMessage}`, 'detailed')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                {copiedMessage === 'detailed' ? (
                  <>
                    <FiCheckCircle className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Subject: {generatedMessages.subject}</p>
              <p className="text-gray-700 whitespace-pre-wrap">{generatedMessages.detailedMessage}</p>
            </div>
          </div>

          {/* Tips */}
          {generatedMessages.tips && generatedMessages.tips.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tips for Success</h3>
              <ul className="list-disc list-inside space-y-2">
                {generatedMessages.tips.map((tip, idx) => (
                  <li key={idx} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Don'ts */}
          {generatedMessages.doNots && generatedMessages.doNots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What to Avoid</h3>
              <ul className="list-disc list-inside space-y-2">
                {generatedMessages.doNots.map((dont, idx) => (
                  <li key={idx} className="text-red-600">{dont}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Strategy Tab */}
      {activeTab === 'strategy' && strategy && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Your Networking Strategy</h2>
          
          {/* Action Plan */}
          {strategy.actionPlan && strategy.actionPlan.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Action Plan</h3>
              <div className="space-y-4">
                {strategy.actionPlan.map((step, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{step.action}</h4>
                        <p className="text-sm text-gray-600">{step.timeline}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{step.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Contacts */}
          {strategy.targetContacts && strategy.targetContacts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Who to Reach Out To</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategy.targetContacts.map((target, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{target.role}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        target.priority === 'high' ? 'bg-red-100 text-red-800' :
                        target.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {target.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{target.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          {strategy.platforms && strategy.platforms.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Platforms to Use</h3>
              <div className="flex flex-wrap gap-2">
                {strategy.platforms.map((platform, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Talking Points */}
          {strategy.talkingPoints && strategy.talkingPoints.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Talking Points</h3>
              <ul className="list-disc list-inside space-y-2">
                {strategy.talkingPoints.map((point, idx) => (
                  <li key={idx} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Tips */}
          {strategy.followUpTips && strategy.followUpTips.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow-up Strategy</h3>
              <ul className="list-disc list-inside space-y-2">
                {strategy.followUpTips.map((tip, idx) => (
                  <li key={idx} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {contacts.length === 0 && !searching && (
        <div className="text-center py-12">
          <FiUsers className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Networking Journey</h3>
          <p className="text-gray-600">
            Enter a role and company above to find professionals who can help you land your dream job
          </p>
        </div>
      )}
    </div>
  );
};

export default NetworkingHelper;
