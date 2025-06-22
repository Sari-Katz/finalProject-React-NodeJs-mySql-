const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  let token = req.cookies?.token;
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1]; // "Bearer xyz"
  }
  if (!token) return res.status(401).json({ message: 'Missing token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = userData; 
    next();
  });
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Permission denied' });
  }
  next();
};

module.exports = { authenticateToken, requireRole };
