const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile
const getProfile = async (req, res) => {
    try {
        console.log('Get profile request for user:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Profile retrieved successfully');
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        console.log('Update profile request for user:', req.user.id);
        const { firstName, lastName, phoneNumber } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        await user.save();
        console.log('Profile updated successfully');
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        console.log('Change password request for user:', req.user.id);
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            console.log('Current password is incorrect');
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();
        console.log('Password changed successfully');
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete account
const deleteAccount = async (req, res) => {
    try {
        console.log('Delete account request for user:', req.user.id);
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        console.log('Account deleted successfully');
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
}; 