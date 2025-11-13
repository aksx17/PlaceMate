const User = require('../models/User');
const jwt = require('jsonwebtoken');
const githubService = require('../services/githubService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    let { name, email, password, githubUsername, linkedinUrl } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Clean GitHub username if provided (extract from URL)
    if (githubUsername) {
      githubUsername = extractGithubUsername(githubUsername);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      githubUsername,
      linkedinUrl
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to extract username from GitHub URL
const extractGithubUsername = (input) => {
  if (!input) return input;
  
  const trimmed = input.trim();
  
  // Check if it's a URL and extract username
  const urlPatterns = [
    /^https?:\/\/github\.com\/([^\/]+)/i,
    /^github\.com\/([^\/]+)/i,
    /^www\.github\.com\/([^\/]+)/i
  ];
  
  for (const pattern of urlPatterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return trimmed;
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedJobs')
      .populate('appliedJobs.job');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Clean GitHub username if provided (extract from URL)
    if (updates.githubUsername) {
      updates.githubUsername = extractGithubUsername(updates.githubUsername);
      
      // Validate the cleaned username
      try {
        const profile = await githubService.getUserProfile(updates.githubUsername);
        console.log(`✓ Validated GitHub username: ${updates.githubUsername} (${profile.name})`);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `GitHub username validation failed: ${error.message}`,
          field: 'githubUsername'
        });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Validate GitHub username
// @route   POST /api/auth/validate-github
exports.validateGithubUsername = async (req, res) => {
  try {
    let { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username is required'
      });
    }

    // Clean GitHub username (extract from URL if needed)
    username = extractGithubUsername(username);

    const profile = await githubService.getUserProfile(username);

    res.json({
      success: true,
      message: 'GitHub username is valid',
      data: {
        username,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        publicRepos: profile.publicRepos
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
