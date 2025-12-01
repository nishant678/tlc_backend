const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_super_secret_jwt_key_change_this_in_production";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

module.exports = { generateToken };