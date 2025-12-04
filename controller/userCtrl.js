const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_super_secret_jwt_key_change_this_in_production";

// -------------------- REGISTER --------------------
const createUser = asyncHandler(async (req, res) => {
  const { name, mobile, email, password } = req.body;

  // Check existing
  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const image = req.file ? req.file.filename : "";

  const newUser = await User.create({
    name,
    mobile,
    email,
    password: hashedPassword,
    image: image,
  });

  res.status(201).json({
    status: true,
    message: "User registered successfully",
    data: newUser,
  });
});

// -------------------- LOGIN --------------------
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check user
  const findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create JWT
  const token = jwt.sign({ id: findUser._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    status: true,
    message: "Login successful",
    token: token,
    user: findUser,
  });
});

const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    status: true,
    message: "User details fetched successfully",
    data: user
  });
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const updateData = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
  };

  // If new image uploaded
  if (req.file) {
    updateData.image = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  ).select("-password");

  res.status(200).json({
    status: true,
    message: "User updated successfully",
    data: updatedUser
  });
});



module.exports = {
  createUser,
  loginUserCtrl,
  getUserDetails,
  updateUserDetails,
};
