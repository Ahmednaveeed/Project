const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Learner',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    refundDetails: {
        amount: Number,
        reason: String,
        processedAt: Date
    }
});

module.exports = mongoose.model('Payment', paymentSchema); 