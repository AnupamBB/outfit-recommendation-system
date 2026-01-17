const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendation-controller');

router.get('/health', recommendationController.health);
router.get('/products-list', recommendationController.productsList);
router.post('/outfit-recommendations', recommendationController.getOutfitRecommendations);

module.exports = router;