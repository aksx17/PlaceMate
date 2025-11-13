const express = require('express');
const router = express.Router();
const {
  generatePortfolio,
  getPortfolio,
  updatePortfolio,
  togglePublish,
  exportPortfolio
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generatePortfolio);
router.get('/:userId', getPortfolio);
router.put('/:id', protect, updatePortfolio);
router.patch('/:id/publish', protect, togglePublish);
router.get('/:id/export', exportPortfolio);

module.exports = router;
