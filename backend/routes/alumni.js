const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const {
  importAlumniData,
  getAlumniStats,
  downloadTemplate,
  getAllAlumni
} = require('../controllers/alumniController');

// Configure multer for Excel file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp/');
  },
  filename: (req, file, cb) => {
    cb(null, `alumni-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Only Excel files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @route   POST /api/alumni/import
// @desc    Import alumni data from Excel file
// @access  Private (Admin only - add admin middleware if needed)
router.post('/import', protect, upload.single('file'), importAlumniData);

// @route   GET /api/alumni/stats
// @desc    Get alumni statistics
// @access  Private
router.get('/stats', protect, getAlumniStats);

// @route   GET /api/alumni/template
// @desc    Download Excel template for alumni data
// @access  Private
router.get('/template', protect, downloadTemplate);

// @route   GET /api/alumni
// @desc    Get all SMVDU alumni with filters
// @access  Private
router.get('/', protect, getAllAlumni);

module.exports = router;
