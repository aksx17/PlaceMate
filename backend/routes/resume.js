const express = require('express');
const router = express.Router();
const {
  generateResume,
  getResumes,
  getResume,
  updateResume,
  generatePDF
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateResume);
router.get('/', protect, getResumes);
router.get('/:id/pdf', protect, generatePDF);  // PDF route must come before /:id
router.get('/:id', protect, getResume);
router.put('/:id', protect, updateResume);

module.exports = router;
