const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const Learner = require('../models/Learner');
const User = require('../models/User');

// Get learner profile
router.get('/LearnerProfile', auth, checkRole(['learner']), async (req, res) => {
  try {
    console.log('Profile request received:', {
      userId: req.user.id,
      userRole: req.user.role,
      headers: req.headers
    });

    const learner = await Learner.findOne({ user: req.user.id })
      .populate('user', 'firstName lastName email phoneNumber')
      .populate('bookings')
      .populate('learningProgress.completedLessons');

    console.log('Found learner:', learner ? {
      id: learner._id,
      userId: learner.user,
      hasBookings: learner.bookings?.length > 0,
      hasProgress: !!learner.learningProgress
    } : 'No learner found');

    if (!learner) {
      console.log('Learner not found for user:', req.user.id);
      return res.status(404).json({ message: 'Learner not found' });
    }

    // Calculate age from dateOfBirth
    const age = Math.floor((new Date() - new Date(learner.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));

    const responseData = {
      fullName: `${learner.user.firstName} ${learner.user.lastName}`,
      email: learner.user.email,
      age: age,
      phoneNumber: learner.user.phoneNumber,
      address: learner.address,
      preferredVehicleType: learner.preferredVehicleType,
      profilePicture: learner.profilePicture,
      learningProgress: learner.learningProgress,
      bookings: learner.bookings
    };

    console.log('Sending response data:', {
      fullName: responseData.fullName,
      email: responseData.email,
      hasProgress: !!responseData.learningProgress,
      hasBookings: responseData.bookings?.length > 0
    });

    res.json(responseData);
  } catch (err) {
    console.error('Error in profile route:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update learner profile
router.put('/LearnerProfile', auth, checkRole(['learner']), async (req, res) => {
  try {
    const learner = await Learner.findOne({ user: req.user.id });
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    const updates = {
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address,
      preferredVehicleType: req.body.preferredVehicleType,
      profilePicture: req.body.profilePicture
    };

    Object.assign(learner, updates);
    await learner.save();

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

// Get learning progress
router.get('/LearningProgress', auth, checkRole(['learner']), async (req, res) => {
  try {
    const learner = await Learner.findOne({ user: req.user.id })
      .populate('learningProgress.completedLessons')
      .select('learningProgress');

    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    res.json(learner.learningProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update learning progress
router.put('/LearningProgress', auth, checkRole(['learner']), async (req, res) => {
  try {
    const learner = await Learner.findOne({ user: req.user.id });
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    const updates = {
      'learningProgress.completedLessons': req.body.completedLessons,
      'learningProgress.quizScore': req.body.quizScore,
      'learningProgress.hasPassedQuiz': req.body.hasPassedQuiz
    };

    Object.assign(learner.learningProgress, updates);
    await learner.save();

    res.json({ message: 'Learning progress updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if learner exists
router.get('/CheckLearner', auth, checkRole(['learner']), async (req, res) => {
  try {
    console.log('Checking learner existence for user:', req.user.id);
    
    const learner = await Learner.findOne({ user: req.user.id });
    console.log('Learner exists:', !!learner);
    
    if (!learner) {
      // Create a new learner document if it doesn't exist
      const newLearner = new Learner({
        user: req.user.id,
        dateOfBirth: new Date(), // You'll need to update this
        preferredVehicleType: 'car'
      });
      
      await newLearner.save();
      console.log('Created new learner document');
      return res.json({ message: 'Created new learner profile' });
    }
    
    res.json({ message: 'Learner profile exists' });
  } catch (err) {
    console.error('Error checking learner:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 