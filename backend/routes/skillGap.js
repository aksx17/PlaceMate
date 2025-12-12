const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  analyzeSkillGap,
  getSkillGapByJob,
  getAllSkillGaps,
  deleteSkillGap,
  getSkillGapStats
} = require('../controllers/skillGapController');

// @route   POST /api/skill-gap/analyze
// @desc    Analyze skill gap for a job
// @access  Private
router.post('/analyze', protect, analyzeSkillGap);

// @route   GET /api/skill-gap/stats
// @desc    Get skill gap statistics
// @access  Private
router.get('/stats', protect, getSkillGapStats);

// @route   GET /api/skill-gap/job/:jobId
// @desc    Get skill gap analysis for a specific job
// @access  Private
router.get('/job/:jobId', protect, getSkillGapByJob);

// @route   GET /api/skill-gap
// @desc    Get all skill gap analyses for user
// @access  Private
router.get('/', protect, getAllSkillGaps);

// @route   DELETE /api/skill-gap/:id
// @desc    Delete skill gap analysis
// @access  Private
router.delete('/:id', protect, deleteSkillGap);

module.exports = router;
