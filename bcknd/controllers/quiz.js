const Quiz = require('../models/Quiz');
const Learner = require('../models/Learner');

// Get quiz questions
const getQuiz = async (req, res) => {
    try {
        console.log('Get quiz request:', req.params.quizId);
        const quiz = await Quiz.findById(req.params.quizId)
            .select('-answers');
        
        if (!quiz) {
            console.log('Quiz not found:', req.params.quizId);
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        console.log('Quiz retrieved successfully');
        res.json(quiz);
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Submit quiz answers
const submitQuiz = async (req, res) => {
    try {
        console.log('Submit quiz request for user:', req.user.id);
        const { quizId, answers } = req.body;
        
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            console.log('Quiz not found:', quizId);
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate score
        let score = 0;
        const results = quiz.questions.map((question, index) => {
            const isCorrect = question.correctAnswer === answers[index];
            if (isCorrect) score++;
            return {
                question: question.question,
                userAnswer: answers[index],
                correctAnswer: question.correctAnswer,
                isCorrect
            };
        });

        const percentageScore = (score / quiz.questions.length) * 100;
        const passed = percentageScore >= quiz.passingScore;

        // Update learner's quiz history
        const learner = await Learner.findOne({ user: req.user.id });
        if (!learner) {
            console.log('Learner profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Learner profile not found' });
        }

        learner.quizHistory.push({
            quiz: quizId,
            score: percentageScore,
            passed,
            date: new Date(),
            results
        });

        await learner.save();
        
        console.log('Quiz submitted successfully');
        res.json({
            score: percentageScore,
            passed,
            results
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get quiz results
const getQuizResults = async (req, res) => {
    try {
        console.log('Get quiz results request for user:', req.user.id);
        const learner = await Learner.findOne({ user: req.user.id })
            .populate('quizHistory.quiz');
        
        if (!learner) {
            console.log('Learner profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Learner profile not found' });
        }
        
        console.log('Quiz results retrieved successfully');
        res.json(learner.quizHistory);
    } catch (error) {
        console.error('Get quiz results error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add quiz (admin only)
const addQuiz = async (req, res) => {
    try {
        console.log('Add quiz request');
        const { title, description, questions, passingScore } = req.body;
        
        const quiz = new Quiz({
            title,
            description,
            questions,
            passingScore
        });

        await quiz.save();
        console.log('Quiz added successfully');
        res.status(201).json(quiz);
    } catch (error) {
        console.error('Add quiz error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update quiz (admin only)
const updateQuiz = async (req, res) => {
    try {
        console.log('Update quiz request:', req.params.quizId);
        const { title, description, questions, passingScore } = req.body;
        
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            console.log('Quiz not found:', req.params.quizId);
            return res.status(404).json({ message: 'Quiz not found' });
        }

        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.questions = questions || quiz.questions;
        quiz.passingScore = passingScore || quiz.passingScore;

        await quiz.save();
        console.log('Quiz updated successfully');
        res.json(quiz);
    } catch (error) {
        console.error('Update quiz error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete quiz (admin only)
const deleteQuiz = async (req, res) => {
    try {
        console.log('Delete quiz request:', req.params.quizId);
        const quiz = await Quiz.findById(req.params.quizId);
        
        if (!quiz) {
            console.log('Quiz not found:', req.params.quizId);
            return res.status(404).json({ message: 'Quiz not found' });
        }

        await quiz.remove();
        console.log('Quiz deleted successfully');
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getQuiz,
    submitQuiz,
    getQuizResults,
    addQuiz,
    updateQuiz,
    deleteQuiz
}; 