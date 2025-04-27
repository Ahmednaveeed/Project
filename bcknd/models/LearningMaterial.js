const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'video', 'pdf', 'quiz'],
        required: true
    },
    category: {
        type: String,
        enum: ['theory', 'practical', 'safety', 'rules'],
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
    duration: {
        type: Number, // in minutes
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LearningMaterial', learningMaterialSchema); 