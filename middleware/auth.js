const jwt = require('jsonwebtoken');
const config = require('config');

const authorize = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const accessToken = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.'});
  }
};

module.exports = authorize;
