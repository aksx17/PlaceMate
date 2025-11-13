const Job = require('../models/Job');
const User = require('../models/User');
const scraperOrchestrator = require('../services/scrapers/scraperOrchestrator');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      techStack,
      source,
      page = 1,
      limit = 20,
      sortBy = '-postedDate'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (techStack) {
      const techArray = techStack.split(',');
      query.techStack = { $in: techArray };
    }

    if (source) {
      query.source = source;
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
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

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Trigger job scraping
// @route   POST /api/jobs/scrape
exports.scrapeJobs = async (req, res) => {
  try {
    const { source, keywords, location } = req.body;

    let results;
    if (source && source !== 'all') {
      results = await scraperOrchestrator.scrapeSingle(source, { keywords, location });
    } else {
      results = await scraperOrchestrator.scrapeAll({ keywords, location });
    }

    res.json({
      success: true,
      message: 'Scraping completed',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Save job
// @route   POST /api/jobs/:id/save
exports.saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.savedJobs.includes(req.params.id)) {
      user.savedJobs.push(req.params.id);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Job saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Apply to job
// @route   POST /api/jobs/:id/apply
exports.applyToJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const alreadyApplied = user.appliedJobs.find(
      app => app.job.toString() === req.params.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'Already applied to this job'
      });
    }

    user.appliedJobs.push({
      job: req.params.id,
      status: 'applied'
    });
    await user.save();

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
exports.getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalJobs = await Job.countDocuments({ isActive: true });
    const latestUpdate = await Job.findOne().sort('-metadata.scrapedAt').select('metadata.scrapedAt');

    res.json({
      success: true,
      data: {
        total: totalJobs,
        bySource: stats,
        lastUpdated: latestUpdate?.metadata.scrapedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
