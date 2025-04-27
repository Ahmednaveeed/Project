const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/auth');

// Register a new user
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('phoneNumber').notEmpty(),
    body('role').isIn(['learner', 'instructor']),
    body('dateOfBirth').optional().isISO8601(),
    body('vehicleType').optional().isIn(['car', 'motorcycle', 'truck'])
], async (req, res) => {
    console.log('Register request received:', { email: req.body.email, role: req.body.role });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    await authController.register(req, res);
});

// Login user
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    console.log('Login request received:', { email: req.body.email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    await authController.login(req, res);
});

// Logout user
router.post('/logout', async (req, res) => {
    console.log('Logout request received');
    await authController.logout(req, res);
});

module.exports = router; 