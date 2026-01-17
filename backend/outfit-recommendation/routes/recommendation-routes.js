const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendation-controller');

// Health check
router.get('/health', recommendationController.health);

// Get outfit recommendations
router.post('/recommend', recommendationController.recommend);

module.exports = router;