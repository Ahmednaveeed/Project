const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const Instructor = require('../models/Instructor');
const User = require('../models/User');

// Get instructor profile
router.get('/InstructorProfile', auth, checkRole(['instructor']), async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id })
      .populate('user', 'firstName lastName email phoneNumber')
      .populate('bookings')
      .populate('vehicles');

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const responseData = {
      fullName: `${instructor.user.firstName} ${instructor.user.lastName}`,
      email: instructor.user.email,
      phoneNumber: instructor.user.phoneNumber,
      experience: instructor.experience,
      hourlyRate: instructor.hourlyRate,
      availability: instructor.availability,
      vehicles: instructor.vehicles,
      bookings: instructor.bookings
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update instructor profile
router.put('/InstructorProfile', auth, checkRole(['instructor']), async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const updates = {
      experience: req.body.experience,
      hourlyRate: req.body.hourlyRate,
      availability: req.body.availability
    };

    Object.assign(instructor, updates);
    await instructor.save();

    // Update user information
    const user = await User.findById(req.user.id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      await user.save();
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add vehicle
router.post('/AddVehicle', auth, checkRole(['instructor']), async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const newVehicle = {
      vehicleType: req.body.vehicleType,
      makeModel: req.body.makeModel,
      year: req.body.year,
      transmission: req.body.transmission
    };

    instructor.vehicles.push(newVehicle);
    await instructor.save();

    res.json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking requests
router.get('/BookingRequests', auth, checkRole(['instructor']), async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id })
      .populate({
        path: 'bookings',
        match: { status: 'pending' }
      });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor.bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/BookingRequests/:id', auth, checkRole(['instructor']), async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const booking = instructor.bookings.id(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.status;
    await instructor.save();

    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get earnings
router.get('/Earnings', auth, checkRole(['instructor']), async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id })
      .populate({
        path: 'bookings',
        match: { status: 'completed' }
      });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const earnings = instructor.bookings.reduce((total, booking) => {
      return total + (booking.duration * instructor.hourlyRate);
    }, 0);

    res.json({ totalEarnings: earnings, bookings: instructor.bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings
router.get('/Ratings', auth, checkRole(['instructor']), async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ user: req.user.id })
      .populate('ratings.learner');

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor.ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search instructors
router.get('/search', auth, async (req, res) => {
    try {
        const { 
            vehicleType, 
            minRating, 
            maxRate, 
            location,
            availability 
        } = req.query;

        let query = {};

        if (vehicleType) {
            query.vehicleTypes = vehicleType;
        }

        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        if (maxRate) {
            query.hourlyRate = { $lte: parseFloat(maxRate) };
        }

        if (location) {
            query.location = new RegExp(location, 'i');
        }

        if (availability) {
            query.availability = {
                $elemMatch: {
                    day: availability.day,
                    timeSlots: { $in: availability.timeSlots }
                }
            };
        }

        const instructors = await Instructor.find(query)
            .populate('user', 'firstName lastName email phoneNumber profilePicture')
            .select('-__v');

        res.json(instructors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all instructors
router.get('/', auth, async (req, res) => {
    try {
        const instructors = await Instructor.find()
            .populate('user', 'firstName lastName email phoneNumber profilePicture')
            .select('-__v');
        res.json(instructors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get instructor by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id)
            .populate('user', 'firstName lastName email phoneNumber profilePicture')
            .select('-__v');
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(instructor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 