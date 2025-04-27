const mongoose = require('mongoose');
const User = require('./User');

const instructorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true,
        default: 1000
    },
    vehicleTypes: [{
        type: String,
        enum: ['car', 'motorcycle', 'truck'],
        required: true
    }],
    vehicles: [{
        vehicleType: {
            type: String,
            enum: ['hatchback', 'sedan', 'suv', 'mpv'],
            required: true
        },
        makeModel: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        transmission: {
            type: String,
            enum: ['automatic', 'manual'],
            required: true
        }
    }],
    availability: {
        isAvailable: {
            type: Boolean,
            default: true
        },
        schedule: [{
            day: {
                type: String,
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            timeSlots: [{
                start: String,
                end: String
            }]
        }]
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        },
        reviews: [{
            learner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Learner'
            },
            rating: Number,
            comment: String,
            date: {
                type: Date,
                default: Date.now
            }
        }]
    },
    earnings: {
        total: {
            type: Number,
            default: 0
        },
        history: [{
            date: Date,
            amount: Number,
            booking: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking'
            }
        }]
    },
    profilePicture: {
        type: String,
        default: '/uploads/profile-pictures/default.png'
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    documents: [{
        type: {
            type: String,
            enum: ['license', 'certification', 'insurance'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Instructor', instructorSchema); 