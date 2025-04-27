const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const LearningMaterial = require('../models/LearningMaterial');
const Quiz = require('../models/Quiz');
const Learner = require('../models/Learner');

// Get all learning materials
router.get('/materials', auth, async (req, res) => {
    try {
        const { vehicleType, category, difficulty } = req.query;
        const query = {};

        if (vehicleType) query.vehicleType = vehicleType;
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const materials = await LearningMaterial.find(query);
        res.json(materials);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific learning material
router.get('/materials/:id', auth, async (req, res) => {
    try {
        const material = await LearningMaterial.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Learning material not found' });
        }
        res.json(material);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all quizzes
router.get('/quizzes', auth, async (req, res) => {
    try {
        const { vehicleType, difficulty } = req.query;
        const query = {};

        if (vehicleType) query.vehicleType = vehicleType;
        if (difficulty) query.difficulty = difficulty;

        const quizzes = await Quiz.find(query);
        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific quiz
router.get('/quizzes/:id', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit quiz answers
router.post('/quizzes/:id/submit', auth, checkRole(['learner']), async (req, res) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate score
        let correctAnswers = 0;
        quiz.questions.forEach((question, index) => {
            const userAnswer = answers[index];
            const correctOptions = question.options
                .filter(option => option.isCorrect)
                .map(option => option.text);
            
            if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correctOptions.sort())) {
                correctAnswers++;
            }
        });

        const score = (correctAnswers / quiz.questions.length) * 100;
        const hasPassed = score >= quiz.passingScore;

        // Update learner's progress
        const learner = await Learner.findOne({ user: req.user._id });
        learner.learningProgress.quizScore = score;
        learner.learningProgress.hasPassedQuiz = hasPassed;
        await learner.save();

        res.json({
            score,
            hasPassed,
            totalQuestions: quiz.questions.length,
            correctAnswers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 