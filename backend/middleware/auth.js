const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Solo admins' });
  next();
}

module.exports = { verifyToken, isAdmin };