const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('No token provided in request');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log('Token decoded successfully:', { userId: decoded.userId });

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('User not found for token:', decoded.userId);
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request
        req.user = {
            id: user._id,
            role: user.role
        };
        console.log('User authenticated:', { userId: user._id, role: user.role });
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth; 