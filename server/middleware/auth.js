const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authorizeEmployee(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'empleado') {
    return res.sendStatus(403);
  }
  next();
}

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = await jwt.verify(token, 'secretkey');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
};


module.exports = {
  authenticateToken,
  authorizeEmployee,
  verifyToken,
};
