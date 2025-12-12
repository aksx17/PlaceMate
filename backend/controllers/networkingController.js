const NetworkingContact = require('../models/NetworkingContact');
const Job = require('../models/Job');
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const networkingService = require('../services/networkingService');
const githubService = require('../services/githubService');

/**
 * @desc    Find alumni/professionals for a specific role and company
 * @route   POST /api/networking/find-contacts
 * @access  Private
 */
exports.findContacts = async (req, res) => {
  try {
    const { targetRole, targetCompany, institution, department, jobId } = req.body;
    const userId = req.user._id;

    let job = null;
    let finalRole = targetRole;
    let finalCompany = targetCompany;

    // If jobId is provided, get job details
    if (jobId) {
      job = await Job.findById(jobId);
      if (job) {
        finalRole = finalRole || job.title;
        finalCompany = finalCompany || job.company;
      }
    }

    // At least one search criteria is required
    if (!finalRole && !finalCompany) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a target role or company'
      });
    }

    console.log(`Finding contacts for: ${finalRole || 'Any Role'} at ${finalCompany || 'Any Company'}`);

    // Build search query dynamically
    const searchConditions = [];

    // Role condition
    if (finalRole) {
      searchConditions.push({ currentRole: { $regex: finalRole, $options: 'i' } });
    }

    // Company condition
    if (finalCompany) {
      searchConditions.push({
        $or: [
          { company: { $regex: finalCompany, $options: 'i' } },
          { 'experience.previousCompanies': { $regex: finalCompany, $options: 'i' } }
        ]
      });
    }

    // Department condition (for SMVDU alumni)
    if (department) {
      searchConditions.push({ 'education.department': department });
    }

    // Institution condition
    if (institution) {
      searchConditions.push({ 'education.institution': { $regex: institution, $options: 'i' } });
    }

    // Build final query
    const query = searchConditions.length > 0 ? { $and: searchConditions } : {};

    // Search in database
    const dbContacts = await NetworkingContact.find(query).limit(50);

    console.log(`Found ${dbContacts.length} contacts in database`);

    // Search GitHub for people at the company
    let githubContacts = [];
    try {
      const githubUsers = await networkingService.searchGitHubByCompany(finalCompany, 30);
      
      // Convert GitHub users to contact format
      githubContacts = githubUsers.map(user => ({
        name: user.name || user.username,
        profilePicture: user.profilePicture,
        currentRole: 'Software Developer', // GitHub doesn't provide role
        company: user.company || finalCompany,
        location: user.location,
        contactLinks: {
          github: user.github,
          email: user.email,
          portfolio: user.blog
        },
        bio: user.bio,
        source: 'github',
        skills: [], // Would need to analyze repos for skills
        isVerified: false
      }));

      console.log(`Found ${githubContacts.length} contacts on GitHub`);
    } catch (error) {
      console.warn('GitHub search failed:', error.message);
    }

    // Calculate relevance scores
    const criteria = {
      targetRole: finalRole,
      targetCompany: finalCompany,
      institution: institution || req.user.institution,
      requiredSkills: job?.techStack || []
    };

    const allContacts = [...dbContacts, ...githubContacts];
    
    const scoredContacts = allContacts.map(contact => ({
      ...contact.toObject ? contact.toObject() : contact,
      relevanceScore: networkingService.calculateRelevanceScore(contact, criteria)
    }));

    // Sort by relevance score
    scoredContacts.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      success: true,
      data: {
        contacts: scoredContacts.slice(0, 50),
        totalFound: scoredContacts.length,
        searchCriteria: {
          role: finalRole,
          company: finalCompany,
          institution: institution || req.user.institution
        }
      }
    });
  } catch (error) {
    console.error('Find Contacts Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to find contacts'
    });
  }
};

/**
 * @desc    Generate personalized connection message
 * @route   POST /api/networking/generate-message
 * @access  Private
 */
exports.generateMessage = async (req, res) => {
  try {
    const { contactId, purpose, customContext } = req.body;
    const userId = req.user._id;

    // Get user profile
    const user = await User.findById(userId);
    
    // Get contact profile
    const contact = await NetworkingContact.findById(contactId);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Prepare user profile for AI
    const userProfile = {
      name: user.name,
      currentStatus: user.currentStatus || 'Student',
      institution: user.institution,
      skills: user.skills || [],
      targetRole: customContext?.targetRole || 'Software Engineer',
      commonalities: {
        sameCollege: contact.alumniOf?.includes(user.institution),
        commonSkills: user.skills?.filter(s => contact.skills?.includes(s)) || [],
        location: user.location === contact.location
      }
    };

    // Prepare contact profile
    const contactProfile = {
      name: contact.name,
      currentRole: contact.currentRole,
      company: contact.company,
      skills: contact.skills || [],
      education: contact.education || []
    };

    // Generate message using AI
    const messages = await geminiService.generateNetworkingMessage(
      userProfile,
      contactProfile,
      purpose || 'referral'
    );

    res.json({
      success: true,
      data: {
        ...messages,
        contactInfo: {
          name: contact.name,
          role: contact.currentRole,
          company: contact.company
        }
      }
    });
  } catch (error) {
    console.error('Generate Message Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate message'
    });
  }
};

/**
 * @desc    Get networking strategy for a job
 * @route   POST /api/networking/strategy
 * @access  Private
 */
exports.getNetworkingStrategy = async (req, res) => {
  try {
    const { jobId, targetRole, targetCompany } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    let job = null;
    let finalRole = targetRole;
    let finalCompany = targetCompany;

    if (jobId) {
      job = await Job.findById(jobId);
      if (job) {
        finalRole = finalRole || job.title;
        finalCompany = finalCompany || job.company;
      }
    }

    const userProfile = {
      name: user.name,
      institution: user.institution,
      skills: user.skills || [],
      experience: user.experience || []
    };

    const strategy = await geminiService.generateNetworkingStrategy(
      userProfile,
      finalRole,
      finalCompany
    );

    res.json({
      success: true,
      data: strategy
    });
  } catch (error) {
    console.error('Networking Strategy Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate networking strategy'
    });
  }
};

/**
 * @desc    Save a contact to database
 * @route   POST /api/networking/contacts
 * @access  Private
 */
exports.saveContact = async (req, res) => {
  try {
    const contactData = req.body;

    const contact = await NetworkingContact.create(contactData);

    res.json({
      success: true,
      message: 'Contact saved successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all saved contacts
 * @route   GET /api/networking/contacts
 * @access  Private
 */
exports.getAllContacts = async (req, res) => {
  try {
    const { company, role, page = 1, limit = 20 } = req.query;

    const query = {};
    
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }
    
    if (role) {
      query.currentRole = { $regex: role, $options: 'i' };
    }

    const contacts = await NetworkingContact.find(query)
      .sort({ lastUpdated: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await NetworkingContact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get contact by ID
 * @route   GET /api/networking/contacts/:id
 * @access  Private
 */
exports.getContact = async (req, res) => {
  try {
    const contact = await NetworkingContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete contact
 * @route   DELETE /api/networking/contacts/:id
 * @access  Private
 */
exports.deleteContact = async (req, res) => {
  try {
    const contact = await NetworkingContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
