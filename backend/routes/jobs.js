const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  scrapeJobs,
  saveJob,
  applyToJob,
  getJobStats
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/stats', getJobStats);
router.get('/:id', getJob);
router.post('/scrape', protect, scrapeJobs);
router.post('/:id/save', protect, saveJob);
router.post('/:id/apply', protect, applyToJob);

module.exports = router;
