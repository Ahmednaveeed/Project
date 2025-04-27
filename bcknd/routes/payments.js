const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Instructor = require('../models/Instructor');
const Learner = require('../models/Learner');

// Create payment intent
router.post('/create-payment-intent', auth, checkRole(['learner']), async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId)
            .populate('instructor')
            .populate('learner');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: booking.price * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                bookingId: booking._id.toString()
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Handle successful payment
router.post('/success', auth, checkRole(['learner']), async (req, res) => {
    try {
        const { paymentIntentId, bookingId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const payment = new Payment({
            booking: booking._id,
            learner: booking.learner,
            instructor: booking.instructor,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
            status: 'completed',
            paymentMethod: paymentIntent.payment_method_types[0],
            transactionId: paymentIntent.id
        });

        await payment.save();

        // Update booking status
        booking.status = 'confirmed';
        booking.payment = payment._id;
        await booking.save();

        res.json({ message: 'Payment successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment history for learner
router.get('/history/learner', auth, checkRole(['learner']), async (req, res) => {
    try {
        const learner = await Learner.findOne({ user: req.user._id });
        const payments = await Payment.find({ learner: learner._id })
            .populate('booking')
            .populate('instructor');
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment history for instructor
router.get('/history/instructor', auth, checkRole(['instructor']), async (req, res) => {
    try {
        const instructor = await Instructor.findOne({ user: req.user._id });
        const payments = await Payment.find({ instructor: instructor._id })
            .populate('booking')
            .populate('learner');
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Request refund
router.post('/:id/refund', auth, async (req, res) => {
    try {
        const { reason } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check if user is authorized to request refund
        const learner = await Learner.findOne({ user: req.user._id });
        const instructor = await Instructor.findOne({ user: req.user._id });

        if (!learner && !instructor) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (learner && payment.learner.toString() !== learner._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (instructor && payment.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create refund in Stripe
        const refund = await stripe.refunds.create({
            payment_intent: payment.transactionId,
            reason: 'requested_by_customer'
        });

        // Update payment status
        payment.status = 'refunded';
        payment.refundDetails = {
            amount: refund.amount / 100,
            reason,
            processedAt: new Date()
        };
        await payment.save();

        // Update booking status
        const booking = await Booking.findById(payment.booking);
        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Refund processed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 