const jwt = require('jsonwebtoken');

// Middleware to authenticate user token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // Add user info to req.user
    next();
  });
}


// Middleware to check if the user is admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {  // Check if req.user exists and role is 'admin'
    return next();
  }
  res.status(403).json({ message: 'Access denied. Admins only.' });
}

module.exports = {
  authenticateToken,
  isAdmin,
};
