const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, validateGithubUsername } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerValidation, loginValidation } = require('../middleware/validator');

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/validate-github', validateGithubUsername);

module.exports = router;
