const Booking = require('../models/Booking');
const Instructor = require('../models/Instructor');
const Learner = require('../models/Learner');
const Vehicle = require('../models/Vehicle');
const Payment = require('../models/Payment');

// Create booking
const createBooking = async (req, res) => {
    try {
        console.log('Create booking request from user:', req.user.id);
        const { instructorId, vehicleId, date, time, duration, location } = req.body;
        
        // Check if instructor exists and is available
        const instructor = await Instructor.findById(instructorId)
            .populate('user', 'firstName lastName');
        if (!instructor) {
            console.log('Instructor not found:', instructorId);
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Check if vehicle exists and belongs to instructor
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle || vehicle.instructor.toString() !== instructor._id.toString()) {
            console.log('Vehicle not found or does not belong to instructor');
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check if instructor is available at the requested time
        const isAvailable = instructor.availability.some(slot => 
            slot.date.toISOString().split('T')[0] === date &&
            slot.time === time &&
            slot.isAvailable
        );

        if (!isAvailable) {
            console.log('Instructor not available at requested time');
            return res.status(400).json({ message: 'Instructor not available at requested time' });
        }

        // Create booking
        const booking = new Booking({
            learner: req.user.id,
            instructor: instructorId,
            vehicle: vehicleId,
            date,
            time,
            duration,
            location,
            status: 'pending'
        });

        await booking.save();
        
        // Update instructor's availability
        instructor.availability = instructor.availability.map(slot => {
            if (slot.date.toISOString().split('T')[0] === date && slot.time === time) {
                return { ...slot, isAvailable: false };
            }
            return slot;
        });
        await instructor.save();
        
        console.log('Booking created successfully');
        res.status(201).json(booking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get booking details
const getBooking = async (req, res) => {
    try {
        console.log('Get booking request:', req.params.bookingId);
        const booking = await Booking.findById(req.params.bookingId)
            .populate('learner', 'firstName lastName')
            .populate('instructor', 'user')
            .populate('vehicle');
        
        if (!booking) {
            console.log('Booking not found:', req.params.bookingId);
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to view this booking
        if (booking.learner.toString() !== req.user.id && 
            booking.instructor.user.toString() !== req.user.id) {
            console.log('Unauthorized access to booking');
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        console.log('Booking retrieved successfully');
        res.json(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
    try {
        console.log('Update booking status request:', req.params.bookingId);
        const { status } = req.body;
        
        const booking = await Booking.findById(req.params.bookingId)
            .populate('instructor', 'user');
        
        if (!booking) {
            console.log('Booking not found:', req.params.bookingId);
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to update this booking
        if (booking.instructor.user.toString() !== req.user.id) {
            console.log('Unauthorized status update');
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();
        
        console.log('Booking status updated successfully');
        res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        console.log('Cancel booking request:', req.params.bookingId);
        const booking = await Booking.findById(req.params.bookingId)
            .populate('instructor', 'user');
        
        if (!booking) {
            console.log('Booking not found:', req.params.bookingId);
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to cancel this booking
        if (booking.learner.toString() !== req.user.id && 
            booking.instructor.user.toString() !== req.user.id) {
            console.log('Unauthorized cancellation');
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update instructor's availability
        const instructor = await Instructor.findById(booking.instructor._id);
        instructor.availability = instructor.availability.map(slot => {
            if (slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] && 
                slot.time === booking.time) {
                return { ...slot, isAvailable: true };
            }
            return slot;
        });
        await instructor.save();

        booking.status = 'cancelled';
        await booking.save();
        
        console.log('Booking cancelled successfully');
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get booking history
const getBookingHistory = async (req, res) => {
    try {
        console.log('Get booking history request for user:', req.user.id);
        const user = await User.findById(req.user.id);
        
        let bookings;
        if (user.role === 'learner') {
            bookings = await Booking.find({ learner: req.user.id })
                .populate('instructor', 'user')
                .populate('vehicle')
                .sort({ date: -1 });
        } else if (user.role === 'instructor') {
            const instructor = await Instructor.findOne({ user: req.user.id });
            bookings = await Booking.find({ instructor: instructor._id })
                .populate('learner', 'firstName lastName')
                .populate('vehicle')
                .sort({ date: -1 });
        } else {
            console.log('Invalid user role');
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        console.log('Booking history retrieved successfully');
        res.json(bookings);
    } catch (error) {
        console.error('Get booking history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createBooking,
    getBooking,
    updateBookingStatus,
    cancelBooking,
    getBookingHistory
}; 