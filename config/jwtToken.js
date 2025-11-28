const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  // Use default secret if not set (for development only)
  const secret = process.env.JWT_SECRET || 'default_dev_secret_key_change_in_production_min_32_chars_required';
  
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable for production!');
  }
  
  return jwt.sign({ id }, secret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || "30d" 
  });
};

module.exports = { generateToken };