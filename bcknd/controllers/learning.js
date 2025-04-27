const LearningMaterial = require('../models/LearningMaterial');
const Learner = require('../models/Learner');

// Get all learning materials
const getMaterials = async (req, res) => {
    try {
        console.log('Get learning materials request');
        const materials = await LearningMaterial.find()
            .sort({ order: 1 });
        
        console.log('Learning materials retrieved successfully');
        res.json(materials);
    } catch (error) {
        console.error('Get learning materials error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get learning material by ID
const getMaterial = async (req, res) => {
    try {
        console.log('Get learning material request:', req.params.materialId);
        const material = await LearningMaterial.findById(req.params.materialId);
        
        if (!material) {
            console.log('Learning material not found:', req.params.materialId);
            return res.status(404).json({ message: 'Learning material not found' });
        }
        
        console.log('Learning material retrieved successfully');
        res.json(material);
    } catch (error) {
        console.error('Get learning material error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add learning material (admin only)
const addMaterial = async (req, res) => {
    try {
        console.log('Add learning material request');
        const { title, content, type, order, quiz } = req.body;
        
        const material = new LearningMaterial({
            title,
            content,
            type,
            order,
            quiz
        });

        await material.save();
        console.log('Learning material added successfully');
        res.status(201).json(material);
    } catch (error) {
        console.error('Add learning material error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update learning material (admin only)
const updateMaterial = async (req, res) => {
    try {
        console.log('Update learning material request:', req.params.materialId);
        const { title, content, type, order, quiz } = req.body;
        
        const material = await LearningMaterial.findById(req.params.materialId);
        if (!material) {
            console.log('Learning material not found:', req.params.materialId);
            return res.status(404).json({ message: 'Learning material not found' });
        }

        material.title = title || material.title;
        material.content = content || material.content;
        material.type = type || material.type;
        material.order = order || material.order;
        material.quiz = quiz || material.quiz;

        await material.save();
        console.log('Learning material updated successfully');
        res.json(material);
    } catch (error) {
        console.error('Update learning material error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete learning material (admin only)
const deleteMaterial = async (req, res) => {
    try {
        console.log('Delete learning material request:', req.params.materialId);
        const material = await LearningMaterial.findById(req.params.materialId);
        
        if (!material) {
            console.log('Learning material not found:', req.params.materialId);
            return res.status(404).json({ message: 'Learning material not found' });
        }

        await material.remove();
        console.log('Learning material deleted successfully');
        res.json({ message: 'Learning material deleted successfully' });
    } catch (error) {
        console.error('Delete learning material error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Track learning progress
const trackProgress = async (req, res) => {
    try {
        console.log('Track learning progress request for user:', req.user.id);
        const { materialId, status, score } = req.body;
        
        const learner = await Learner.findOne({ user: req.user.id });
        if (!learner) {
            console.log('Learner profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Learner profile not found' });
        }

        // Update or add progress for the material
        const progressIndex = learner.learningProgress.findIndex(
            p => p.material.toString() === materialId
        );

        if (progressIndex >= 0) {
            learner.learningProgress[progressIndex].status = status;
            learner.learningProgress[progressIndex].score = score;
            learner.learningProgress[progressIndex].lastAccessed = new Date();
        } else {
            learner.learningProgress.push({
                material: materialId,
                status,
                score,
                lastAccessed: new Date()
            });
        }

        await learner.save();
        console.log('Learning progress updated successfully');
        res.json({ message: 'Progress updated successfully' });
    } catch (error) {
        console.error('Track learning progress error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get learning progress
const getProgress = async (req, res) => {
    try {
        console.log('Get learning progress request for user:', req.user.id);
        const learner = await Learner.findOne({ user: req.user.id })
            .populate('learningProgress.material');
        
        if (!learner) {
            console.log('Learner profile not found for user:', req.user.id);
            return res.status(404).json({ message: 'Learner profile not found' });
        }
        
        console.log('Learning progress retrieved successfully');
        res.json(learner.learningProgress);
    } catch (error) {
        console.error('Get learning progress error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMaterials,
    getMaterial,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    trackProgress,
    getProgress
}; 