const mongoose = require('mongoose');
const User = require('./User');

const learnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    learningProgress: {
        completedLessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LearningMaterial'
        }],
        quizScore: {
            type: Number,
            default: 0
        },
        hasPassedQuiz: {
            type: Boolean,
            default: false
        }
    },
    preferredVehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'truck'],
        default: 'car'
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    paymentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    profilePicture: {
        type: String,
        default: '/uploads/profile-pictures/default.png'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Learner', learnerSchema); 