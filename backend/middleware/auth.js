const jwt = require('jsonwebtoken');

/**
 * Auth middleware: verifies JWT token from Authorization header.
 * If valid, attaches user data to req.user and proceeds.
 * If invalid or missing, returns 401.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'ไม่ได้เข้าสู่ระบบ กรุณา Login ก่อน' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { name, email, role, department }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token หมดอายุหรือไม่ถูกต้อง กรุณา Login ใหม่' });
  }
};

module.exports = authMiddleware;
