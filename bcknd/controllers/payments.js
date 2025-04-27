const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Instructor = require('../models/Instructor');
const Learner = require('../models/Learner');

// Process payment
const processPayment = async (req, res) => {
    try {
        console.log('Process payment request for booking:', req.params.bookingId);
        const { amount, paymentMethod, transactionId } = req.body;
        
        // Check if booking exists
        const booking = await Booking.findById(req.params.bookingId)
            .populate('instructor', 'user');
        
        if (!booking) {
            console.log('Booking not found:', req.params.bookingId);
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to make payment
        if (booking.learner.toString() !== req.user.id) {
            console.log('Unauthorized payment attempt');
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if booking is already paid
        const existingPayment = await Payment.findOne({ booking: booking._id });
        if (existingPayment) {
            console.log('Payment already exists for booking');
            return res.status(400).json({ message: 'Payment already processed' });
        }

        // Create payment record
        const payment = new Payment({
            booking: booking._id,
            learner: req.user.id,
            instructor: booking.instructor._id,
            amount,
            paymentMethod,
            transactionId,
            status: 'completed'
        });

        await payment.save();
        
        // Update booking status
        booking.status = 'confirmed';
        await booking.save();
        
        console.log('Payment processed successfully');
        res.status(201).json(payment);
    } catch (error) {
        console.error('Process payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get payment details
const getPayment = async (req, res) => {
    try {
        console.log('Get payment request:', req.params.paymentId);
        const payment = await Payment.findById(req.params.paymentId)
            .populate('booking')
            .populate('learner', 'firstName lastName')
            .populate('instructor', 'user');
        
        if (!payment) {
            console.log('Payment not found:', req.params.paymentId);
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check if user is authorized to view this payment
        if (payment.learner.toString() !== req.user.id && 
            payment.instructor.user.toString() !== req.user.id) {
            console.log('Unauthorized access to payment');
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        console.log('Payment retrieved successfully');
        res.json(payment);
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
    try {
        console.log('Get payment history request for user:', req.user.id);
        const user = await User.findById(req.user.id);
        
        let payments;
        if (user.role === 'learner') {
            payments = await Payment.find({ learner: req.user.id })
                .populate('booking')
                .populate('instructor', 'user')
                .sort({ date: -1 });
        } else if (user.role === 'instructor') {
            const instructor = await Instructor.findOne({ user: req.user.id });
            payments = await Payment.find({ instructor: instructor._id })
                .populate('booking')
                .populate('learner', 'firstName lastName')
                .sort({ date: -1 });
        } else {
            console.log('Invalid user role');
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        console.log('Payment history retrieved successfully');
        res.json(payments);
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Handle refund
const processRefund = async (req, res) => {
    try {
        console.log('Process refund request for payment:', req.params.paymentId);
        const { reason } = req.body;
        
        const payment = await Payment.findById(req.params.paymentId)
            .populate('booking')
            .populate('instructor', 'user');
        
        if (!payment) {
            console.log('Payment not found:', req.params.paymentId);
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check if user is authorized to process refund
        if (payment.instructor.user.toString() !== req.user.id) {
            console.log('Unauthorized refund attempt');
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create refund record
        const refund = new Payment({
            booking: payment.booking._id,
            learner: payment.learner,
            instructor: payment.instructor._id,
            amount: -payment.amount,
            paymentMethod: payment.paymentMethod,
            status: 'refunded',
            refundReason: reason
        });

        await refund.save();
        
        // Update original payment status
        payment.status = 'refunded';
        await payment.save();
        
        // Update booking status
        const booking = await Booking.findById(payment.booking._id);
        booking.status = 'cancelled';
        await booking.save();
        
        console.log('Refund processed successfully');
        res.json(refund);
    } catch (error) {
        console.error('Process refund error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    processPayment,
    getPayment,
    getPaymentHistory,
    processRefund
}; 