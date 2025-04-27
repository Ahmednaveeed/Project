const Learner = require('../models/Learner');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Get learner profile
const getProfile = async (req, res) => {
    try {
        console.log('Get learner profile request for user:', req.user.id);
        const learner = await Learner.findOne({ user: req.user.id })
            .populate('user', 'firstName lastName email phoneNumber')
            .populate('bookings')
            .populate('paymentHistory');
        
        if (!learner) {
            console.log('Learner profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Learner profile not found' });
        }
        
        console.log('Learner profile retrieved successfully');
        res.json(learner);
    } catch (error) {
        console.error('Get learner profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update learner profile
const updateProfile = async (req, res) => {
    try {
        console.log('Update learner profile request for user:', req.user.id);
        const { dateOfBirth, preferredVehicleType, learningProgress } = req.body;
        
        const learner = await Learner.findOne({ user: req.user.id });
        if (!learner) {
            console.log('Learner profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Learner profile not found' });
        }

        learner.dateOfBirth = dateOfBirth || learner.dateOfBirth;
        learner.preferredVehicleType = preferredVehicleType || learner.preferredVehicleType;
        learner.learningProgress = learningProgress || learner.learningProgress;

        await learner.save();
        console.log('Learner profile updated successfully');
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update learner profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get learning progress
const getLearningProgress = async (req, res) => {
    try {
        console.log('Get learning progress request for user:', req.user.id);
        const learner = await Learner.findOne({ user: req.user.id })
            .select('learningProgress');
        
        if (!learner) {
            console.log('Learner profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Learner profile not found' });
        }
        
        console.log('Learning progress retrieved successfully');
        res.json(learner.learningProgress);
    } catch (error) {
        console.error('Get learning progress error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get booking history
const getBookingHistory = async (req, res) => {
    try {
        console.log('Get booking history request for user:', req.user.id);
        const bookings = await Booking.find({ learner: req.user.id })
            .populate('instructor', 'user')
            .populate('vehicle')
            .sort({ date: -1 });
        
        console.log('Booking history retrieved successfully');
        res.json(bookings);
    } catch (error) {
        console.error('Get booking history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
    try {
        console.log('Get payment history request for user:', req.user.id);
        const payments = await Payment.find({ learner: req.user.id })
            .populate('booking')
            .sort({ date: -1 });
        
        console.log('Payment history retrieved successfully');
        res.json(payments);
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getLearningProgress,
    getBookingHistory,
    getPaymentHistory
}; 