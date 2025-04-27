const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const User = require('../models/User');
const Instructor = require('../models/Instructor');
const Learner = require('../models/Learner');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Get all users
router.get('/users', auth, checkRole(['admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID
router.get('/users/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify instructor
router.put('/instructors/:id/verify', auth, checkRole(['admin']), async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        instructor.isVerified = true;
        await instructor.save();

        res.json({ message: 'Instructor verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings
router.get('/bookings', auth, checkRole(['admin']), async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('learner')
            .populate('instructor');
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all payments
router.get('/payments', auth, checkRole(['admin']), async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('booking')
            .populate('learner')
            .populate('instructor');
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Process refund
router.post('/payments/:id/refund', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { reason } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update payment status
        payment.status = 'refunded';
        payment.refundDetails = {
            amount: payment.amount,
            reason,
            processedAt: new Date()
        };
        await payment.save();

        // Update booking status
        const booking = await Booking.findById(payment.booking);
        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Refund processed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get system statistics
router.get('/statistics', auth, checkRole(['admin']), async (req, res) => {
    try {
        const [
            totalUsers,
            totalInstructors,
            totalLearners,
            totalBookings,
            totalPayments,
            totalRevenue
        ] = await Promise.all([
            User.countDocuments(),
            Instructor.countDocuments(),
            Learner.countDocuments(),
            Booking.countDocuments(),
            Payment.countDocuments(),
            Payment.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        res.json({
            totalUsers,
            totalInstructors,
            totalLearners,
            totalBookings,
            totalPayments,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 