const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const Booking = require('../models/Booking');
const Instructor = require('../models/Instructor');
const Learner = require('../models/Learner');

// Create a new booking
router.post('/', auth, checkRole(['learner']), async (req, res) => {
    try {
        const {
            instructor,
            date,
            startTime,
            endTime,
            duration,
            vehicleType,
            location,
            notes
        } = req.body;

        // Check if instructor exists
        const instructorDoc = await Instructor.findById(instructor);
        if (!instructorDoc) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Check if learner has passed the quiz
        const learner = await Learner.findOne({ user: req.user._id });
        if (!learner.learningProgress.hasPassedQuiz) {
            return res.status(400).json({ message: 'You must pass the quiz before booking lessons' });
        }

        // Calculate price
        const price = instructorDoc.hourlyRate * duration;

        const booking = new Booking({
            learner: learner._id,
            instructor,
            date,
            startTime,
            endTime,
            duration,
            vehicleType,
            location,
            notes,
            price
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings for a learner
router.get('/learner', auth, checkRole(['learner']), async (req, res) => {
    try {
        const learner = await Learner.findOne({ user: req.user._id });
        const bookings = await Booking.find({ learner: learner._id })
            .populate('instructor')
            .populate('learner');
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings for an instructor
router.get('/instructor', auth, checkRole(['instructor']), async (req, res) => {
    try {
        const instructor = await Instructor.findOne({ user: req.user._id });
        const bookings = await Booking.find({ instructor: instructor._id })
            .populate('learner')
            .populate('instructor');
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.put('/:id/status', auth, checkRole(['instructor']), async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();
        res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to cancel
        const learner = await Learner.findOne({ user: req.user._id });
        const instructor = await Instructor.findOne({ user: req.user._id });

        if (!learner && !instructor) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (learner && booking.learner.toString() !== learner._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (instructor && booking.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await booking.remove();
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 