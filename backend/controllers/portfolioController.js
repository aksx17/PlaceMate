const Portfolio = require('../models/Portfolio');
const geminiService = require('../services/geminiService');
const githubService = require('../services/githubService');
const fs = require('fs');
const path = require('path');

// @desc    Generate AI portfolio
// @route   POST /api/portfolio/generate
exports.generatePortfolio = async (req, res) => {
  try {
    const { githubUsername, linkedinData, theme = 'modern' } = req.body;
    const userId = req.user._id;

    // Fetch GitHub data with fallback to user's saved username
    let githubData = {};
    const username = githubUsername || req.user.githubUsername;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username is required. Please provide it in the request or update your profile.'
      });
    }

    try {
      githubData = await githubService.getComprehensiveUserData(username);
    } catch (error) {
      console.error(`❌ Failed to fetch GitHub data for username: ${username}`);
      return res.status(400).json({
        success: false,
        message: `Could not fetch GitHub profile for username: ${username}. Please verify the username is correct.`,
        error: error.message
      });
    }

    // Prepare user data
    const userData = {
      githubProjects: githubData.projects || [],
      linkedinData: linkedinData || {},
      skills: githubData.skills?.languages || []
    };

    // Generate portfolio content using Gemini AI
    const aiContent = await geminiService.generatePortfolioContent(userData);

    // Check if portfolio exists
    let portfolio = await Portfolio.findOne({ user: userId });

    const portfolioData = {
      user: userId,
      theme,
      customUrl: username.toLowerCase(),
      content: {
        about: {
          headline: aiContent.headline,
          bio: aiContent.bio,
          profileImage: githubData.profile?.avatarUrl || null
        },
        contact: {
          email: req.user.email,
          social: {
            github: githubData.profile?.githubUrl || `https://github.com/${username}`,
            linkedin: req.user.linkedinUrl
          }
        },
        skills: aiContent.skillCategories.map(cat => ({
          category: cat.category,
          items: cat.skills.map(skill => ({
            name: skill,
            level: 'intermediate'
          }))
        })),
        projects: aiContent.projects.map((proj, idx) => ({
          title: proj.title,
          description: proj.description,
          technologies: proj.highlights || [],
          githubUrl: githubData.projects[idx]?.url,
          featured: idx < 3
        })),
        experience: req.user.experience || [],
        education: req.user.education || [],
        certifications: req.user.certifications || []
      },
      aiGenerated: true,
      published: false
    };

    if (portfolio) {
      portfolio = await Portfolio.findOneAndUpdate(
        { user: userId },
        { $set: portfolioData },
        { new: true }
      );
    } else {
      portfolio = await Portfolio.create(portfolioData);
    }

    res.json({
      success: true,
      message: 'Portfolio generated successfully',
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user portfolio
// @route   GET /api/portfolio/:userId
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId })
      .populate('user', 'name email');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Increment views
    portfolio.views += 1;
    await portfolio.save();

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update portfolio
// @route   PUT /api/portfolio/:id
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Publish/unpublish portfolio
// @route   PATCH /api/portfolio/:id/publish
exports.togglePublish = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    portfolio.published = !portfolio.published;
    await portfolio.save();

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export portfolio as HTML
// @route   GET /api/portfolio/:id/export
exports.exportPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('user');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    const html = generatePortfolioHTML(portfolio);
    const fileName = `portfolio_${portfolio.customUrl}.html`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(html);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to generate portfolio HTML
function generatePortfolioHTML(portfolio) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.user.name} - Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        header h1 { font-size: 3em; margin-bottom: 10px; }
        header p { font-size: 1.2em; }
        section { padding: 40px 20px; }
        h2 { color: #667eea; margin-bottom: 20px; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        .skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .skill-category { background: #f4f4f4; padding: 20px; border-radius: 8px; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .project { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .project h3 { color: #667eea; margin-bottom: 10px; }
        .tech-stack { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .tech-tag { background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; }
        footer { text-align: center; padding: 40px; background: #333; color: white; }
        .social-links a { color: #667eea; margin: 0 10px; text-decoration: none; }
    </style>
</head>
<body>
    <header>
        <h1>${portfolio.user.name}</h1>
        <p>${portfolio.content.about.headline}</p>
    </header>

    <div class="container">
        <section id="about">
            <h2>About Me</h2>
            <p>${portfolio.content.about.bio}</p>
        </section>

        <section id="skills">
            <h2>Skills</h2>
            <div class="skills">
                ${portfolio.content.skills.map(cat => `
                    <div class="skill-category">
                        <h3>${cat.category}</h3>
                        <p>${cat.items.map(item => item.name).join(', ')}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="projects">
            <h2>Projects</h2>
            <div class="projects">
                ${portfolio.content.projects.slice(0, 6).map(proj => `
                    <div class="project">
                        <h3>${proj.title}</h3>
                        <p>${proj.description}</p>
                        <div class="tech-stack">
                            ${proj.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank">View on GitHub</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </section>
    </div>

    <footer>
        <p>Contact: ${portfolio.content.contact.email}</p>
        <div class="social-links">
            ${portfolio.content.contact.social.github ? `<a href="${portfolio.content.contact.social.github}">GitHub</a>` : ''}
            ${portfolio.content.contact.social.linkedin ? `<a href="${portfolio.content.contact.social.linkedin}">LinkedIn</a>` : ''}
        </div>
    </footer>
</body>
</html>
  `;
}

module.exports = exports;
