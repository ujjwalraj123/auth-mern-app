const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    // Split "Bearer <token>" into two parts
    const [bearer, token] = authHeader.split(' ');
    
    if (!token || bearer !== 'Bearer') {
        return res.status(403).json({ message: 'Invalid token format. Use: Bearer <token>' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ 
            message: 'Unauthorized, JWT token invalid or expired',
            error: err.message 
        });
    }
};

module.exports = ensureAuthenticated;