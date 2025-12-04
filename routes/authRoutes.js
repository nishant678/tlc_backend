const express = require('express');
const { createUser, loginUserCtrl, getUserDetails, updateUserDetails } = require("../controller/userCtrl");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// Use upload.single("image") for formData
router.post('/register', upload.single("image"), createUser);
router.post('/login', loginUserCtrl);
router.get("/profile", authMiddleware, getUserDetails);
router.post(
    "/update",
    authMiddleware,
    upload.single("image"),
    updateUserDetails
);

module.exports = router;
