const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Learner = require('../models/Learner');
const Instructor = require('../models/Instructor');
const config = require('../config/config');

// Register a new user
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phoneNumber, role, dateOfBirth, vehicleType } = req.body;
        console.log('Register request details:', { email, role, firstName, lastName });

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            role
        });

        await user.save();
        console.log('New user created:', { id: user._id, email, role });

        // Create role-specific profile
        if (role === 'learner') {
            const learner = new Learner({
                user: user._id,
                dateOfBirth,
                preferredVehicleType: vehicleType
            });
            await learner.save();
            console.log('New learner profile created:', { userId: user._id });
        } else if (role === 'instructor') {
            const { licenseNumber, yearsOfExperience, hourlyRate = 1000, vehicleTypes = ['car'] } = req.body;
            
            if (!licenseNumber || !yearsOfExperience) {
                return res.status(400).json({ 
                    message: 'License number and years of experience are required for instructors' 
                });
            }

            const instructor = new Instructor({
                user: user._id,
                licenseNumber,
                yearsOfExperience,
                hourlyRate,
                vehicleTypes
            });
            await instructor.save();
            console.log('New instructor profile created:', { userId: user._id });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRE }
        );
        console.log('JWT token generated for user:', { userId: user._id });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for user:', email);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login failed: User not found:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Login failed: Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRE }
        );
        console.log('Login successful, token generated for user:', { userId: user._id, email });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        console.log('Logout request processed');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    logout
}; 