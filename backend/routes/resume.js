const express = require('express');
const router = express.Router();
const {
  generateResume,
  getResumes,
  getResume,
  updateResume,
  generatePDF,
  uploadResume,
  uploadMiddleware,
  getResumeText
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateResume);
router.post('/upload', protect, uploadMiddleware, uploadResume);
router.get('/', protect, getResumes);
router.get('/:id/pdf', protect, generatePDF);  // PDF route must come before /:id
router.get('/:id/text', protect, getResumeText);  // Get extracted text
router.get('/:id', protect, getResume);
router.put('/:id', protect, updateResume);

module.exports = router;
