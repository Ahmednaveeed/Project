const Instructor = require('../models/Instructor');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Get instructor profile
const getProfile = async (req, res) => {
    try {
        console.log('Get instructor profile request for user:', req.user.id);
        const instructor = await Instructor.findOne({ user: req.user.id })
            .populate('user', 'firstName lastName email phoneNumber')
            .populate('vehicles')
            .populate('bookings')
            .populate('ratings.learner', 'firstName lastName');
        
        if (!instructor) {
            console.log('Instructor profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Instructor profile not found' });
        }
        
        console.log('Instructor profile retrieved successfully');
        res.json(instructor);
    } catch (error) {
        console.error('Get instructor profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update instructor profile
const updateProfile = async (req, res) => {
    try {
        console.log('Update instructor profile request for user:', req.user.id);
        const { bio, experience, qualifications } = req.body;
        
        const instructor = await Instructor.findOne({ user: req.user.id });
        if (!instructor) {
            console.log('Instructor profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Instructor profile not found' });
        }

        instructor.bio = bio || instructor.bio;
        instructor.experience = experience || instructor.experience;
        instructor.qualifications = qualifications || instructor.qualifications;

        await instructor.save();
        console.log('Instructor profile updated successfully');
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update instructor profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add vehicle
const addVehicle = async (req, res) => {
    try {
        console.log('Add vehicle request for instructor:', req.user.id);
        const { make, model, year, licensePlate, type } = req.body;
        
        const instructor = await Instructor.findOne({ user: req.user.id });
        if (!instructor) {
            console.log('Instructor profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Instructor profile not found' });
        }

        const vehicle = new Vehicle({
            instructor: instructor._id,
            make,
            model,
            year,
            licensePlate,
            type
        });

        await vehicle.save();
        instructor.vehicles.push(vehicle._id);
        await instructor.save();
        
        console.log('Vehicle added successfully');
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Add vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update vehicle
const updateVehicle = async (req, res) => {
    try {
        console.log('Update vehicle request:', req.params.vehicleId);
        const { make, model, year, licensePlate, type } = req.body;
        
        const vehicle = await Vehicle.findById(req.params.vehicleId);
        if (!vehicle) {
            console.log('Vehicle not found:', req.params.vehicleId);
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const instructor = await Instructor.findOne({ user: req.user.id });
        if (!instructor || !instructor.vehicles.includes(vehicle._id)) {
            console.log('Vehicle does not belong to instructor');
            return res.status(403).json({ message: 'Not authorized' });
        }

        vehicle.make = make || vehicle.make;
        vehicle.model = model || vehicle.model;
        vehicle.year = year || vehicle.year;
        vehicle.licensePlate = licensePlate || vehicle.licensePlate;
        vehicle.type = type || vehicle.type;

        await vehicle.save();
        console.log('Vehicle updated successfully');
        res.json(vehicle);
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove vehicle
const removeVehicle = async (req, res) => {
    try {
        console.log('Remove vehicle request:', req.params.vehicleId);
        const vehicle = await Vehicle.findById(req.params.vehicleId);
        if (!vehicle) {
            console.log('Vehicle not found:', req.params.vehicleId);
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const instructor = await Instructor.findOne({ user: req.user.id });
        if (!instructor || !instructor.vehicles.includes(vehicle._id)) {
            console.log('Vehicle does not belong to instructor');
            return res.status(403).json({ message: 'Not authorized' });
        }

        instructor.vehicles = instructor.vehicles.filter(v => v.toString() !== vehicle._id.toString());
        await instructor.save();
        await vehicle.remove();
        
        console.log('Vehicle removed successfully');
        res.json({ message: 'Vehicle removed successfully' });
    } catch (error) {
        console.error('Remove vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update availability
const updateAvailability = async (req, res) => {
    try {
        console.log('Update availability request for instructor:', req.user.id);
        const { availability } = req.body;
        
        const instructor = await Instructor.findOne({ user: req.user.id });
        if (!instructor) {
            console.log('Instructor profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Instructor profile not found' });
        }

        instructor.availability = availability;
        await instructor.save();
        
        console.log('Availability updated successfully');
        res.json({ message: 'Availability updated successfully' });
    } catch (error) {
        console.error('Update availability error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get earnings
const getEarnings = async (req, res) => {
    try {
        console.log('Get earnings request for instructor:', req.user.id);
        const instructor = await Instructor.findOne({ user: req.user.id });
        if (!instructor) {
            console.log('Instructor profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Instructor profile not found' });
        }

        const payments = await Payment.find({ instructor: instructor._id })
            .populate('booking')
            .sort({ date: -1 });
        
        const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);
        
        console.log('Earnings retrieved successfully');
        res.json({
            totalEarnings,
            payments
        });
    } catch (error) {
        console.error('Get earnings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get ratings
const getRatings = async (req, res) => {
    try {
        console.log('Get ratings request for instructor:', req.user.id);
        const instructor = await Instructor.findOne({ user: req.user.id })
            .populate('ratings.learner', 'firstName lastName');
        
        if (!instructor) {
            console.log('Instructor profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Instructor profile not found' });
        }
        
        console.log('Ratings retrieved successfully');
        res.json(instructor.ratings);
    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    addVehicle,
    updateVehicle,
    removeVehicle,
    updateAvailability,
    getEarnings,
    getRatings
}; 