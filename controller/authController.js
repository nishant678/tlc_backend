const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../model/User');
const UserProfile = require('../model/UserProfile');
const { generateToken } = require('../config/jwtToken');
const { validateRegistrationData, validateLoginData } = require('../utils/validation');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  try {
    const validation = validateRegistrationData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const {
      mobile_number,
      email,
      password,
      name,
      dob,
      gender
    } = validation.cleanedData;

    const goals = req.body.goals ? String(req.body.goals).trim() : null;
    const interest = req.body.interest ? String(req.body.interest).trim() : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists, Try Login!"
      });
    }

    const existingMobileUser = await User.findOne({ mobile_number });
    if (existingMobileUser) {
      return res.status(400).json({
        message: "Mobile Number Already Registered!"
      });
    }
    const newUser = new User({
      mobile_number,
      email,
      password,
      name,
      dob,
      gender: gender.toLowerCase(),
      goals,
      interest
    });

    try {
      await newUser.save();

      if (req.file) {
        const imageUrl = `/uploads/profile-images/${req.file.filename}`;
        await UserProfile.create(newUser.id, imageUrl);
      }

      const userWithProfiles = await User.findByIdWithProfiles(newUser.id);

      let token;
      try {
        token = generateToken(newUser.id);
      } catch (error) {
        return res.status(201).json({
          message: "New User Added",
          user: userWithProfiles,
          error: "Token generation failed. Please set JWT_SECRET environment variable."
        });
      }

      res.status(201).json({
        message: "New User Added",
        user: userWithProfiles,
        token
      });
    } catch (saveError) {
      console.log('Save error:', saveError);
      return res.status(500).json({
        message: `Registration Error: ${saveError.message}`
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Registration Error: ${error.message}`
    });
  }
});

/**
 * @desc    Login user with mobile number and password
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { mobile_number, password } = req.body;

    if (!mobile_number) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    const trimmedMobile = String(mobile_number).trim();
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(trimmedMobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid mobile number (10-15 digits)'
      });
    }

    const user = await User.findOne({ mobile_number: trimmedMobile });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    const trimmedPassword = String(password).trim();
    const isPasswordValid = await User.verifyPassword(trimmedPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const userWithProfiles = await User.findByIdWithProfiles(user.id);

    let token;
    try {
      token = generateToken(user.id);
    } catch (error) {
      return res.status(200).json({
        success: true,
        message: 'Login successful, but token generation failed. Please set JWT_SECRET environment variable.',
        error: error.message,
        user: userWithProfiles
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithProfiles,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Login Error: ${error.message}`
    });
  }
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdWithProfiles(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * @desc    Get user profile details
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfileDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user details
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get profile image
    const profile = await UserProfile.findByUserId(userId);

    // Prepare response data (exclude password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile_number: user.mobile_number,
      dob: user.dob,
      gender: user.gender,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    const profileData = profile ? {
      id: profile.id,
      image_url: profile.image_url,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    } : null;

    res.status(200).json({
      success: true,
      message: 'Profile details retrieved successfully',
      data: {
        user: userData,
        profile: profileData
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving profile: ${error.message}`
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getProfileDetails
};

