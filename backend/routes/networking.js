const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  findContacts,
  generateMessage,
  getNetworkingStrategy,
  saveContact,
  getAllContacts,
  getContact,
  deleteContact
} = require('../controllers/networkingController');

// @route   POST /api/networking/find-contacts
// @desc    Find alumni/professionals for a role and company
// @access  Private
router.post('/find-contacts', protect, findContacts);

// @route   POST /api/networking/generate-message
// @desc    Generate personalized connection message
// @access  Private
router.post('/generate-message', protect, generateMessage);

// @route   POST /api/networking/strategy
// @desc    Get networking strategy for a job
// @access  Private
router.post('/strategy', protect, getNetworkingStrategy);

// @route   POST /api/networking/contacts
// @desc    Save a contact
// @access  Private
router.post('/contacts', protect, saveContact);

// @route   GET /api/networking/contacts
// @desc    Get all contacts
// @access  Private
router.get('/contacts', protect, getAllContacts);

// @route   GET /api/networking/contacts/:id
// @desc    Get contact by ID
// @access  Private
router.get('/contacts/:id', protect, getContact);

// @route   DELETE /api/networking/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/contacts/:id', protect, deleteContact);

module.exports = router;
