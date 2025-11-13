const express = require('express');
const router = express.Router();
const {
  generateQuestions,
  submitAnswer,
  getInterview,
  completeInterview,
  getInterviewHistory
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.post('/generate-questions', protect, generateQuestions);
router.post('/:sessionId/answer', protect, submitAnswer);
router.get('/:sessionId', protect, getInterview);
router.post('/:sessionId/complete', protect, completeInterview);
router.get('/history', protect, getInterviewHistory);

module.exports = router;
