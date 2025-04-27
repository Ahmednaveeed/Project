const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const caseInsensitive = require('./middleware/caseInsensitive');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(caseInsensitive);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/learners', require('./routes/learners'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/learning', require('./routes/learning'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Handle token expiration
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    
    // Default error
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 