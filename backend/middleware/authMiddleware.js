
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required. Please log in.',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.studentId) {
      return res.status(401).json({
        message: 'Invalid authentication token.',
      });
    }

    req.studentId = decoded.studentId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Session expired or invalid. Please log in again.',
    });
  }
}

module.exports = authMiddleware;
