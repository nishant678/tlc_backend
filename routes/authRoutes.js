const express = require('express');
const { createUser, loginUserCtrl } = require("../controller/userCtrl");
const upload = require("../middlewares/upload");

const router = express.Router();

// Use upload.single("image") for formData
router.post('/register', upload.single("image"), createUser);
router.post('/login', loginUserCtrl);

module.exports = router;
