const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getProfileDetails
} = require('../controller/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadSingleProfile } = require('../middlewares/uploadMiddleware');

// Public routes
router.post('/register', uploadSingleProfile, registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.get('/profile', authMiddleware, getProfileDetails);

module.exports = router;

