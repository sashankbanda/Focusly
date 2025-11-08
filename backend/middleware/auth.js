const admin = require('../config/firebaseAdmin');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add decoded user info (like uid) to the request object
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error.message);
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token.' });
  }
}

module.exports = { verifyToken };
