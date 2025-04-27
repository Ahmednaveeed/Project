const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }],
        explanation: String
    }],
    passingScore: {
        type: Number,
        required: true,
        default: 70
    },
    timeLimit: {
        type: Number, // in minutes
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'truck'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema); 