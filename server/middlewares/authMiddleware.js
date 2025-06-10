const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer xyz"
console.log(token);
  if (!token) return res.status(401).json({ message: "Missing token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = userData; // כולל id ו-role
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Permission denied" });
    }
    next();
  };
};

module.exports = { authenticateToken, requireRole };
