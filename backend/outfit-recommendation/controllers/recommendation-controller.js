const { getProductsList, getCompleteOutfitRecommendations } = require('../models/recommendation-model');

exports.productsList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination parameters'
            });
        }

        const products = await getProductsList(page, limit);
        return res.status(200).json(products);
    }
    catch (err) {
        console.error('Products list error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch products list'
        });
    }
};

exports.getOutfitRecommendations = async (req, res) => {
    try {
        const { gender, occasion, season, budget, selectedProduct } = req.body;
        if (!gender || !occasion) {
            return res.status(400).json({
                success: false,
                message: 'gender and occasion are required'
            });
        }

        const result = await getCompleteOutfitRecommendations({
            gender,
            occasion,
            season,
            budget: parseInt(budget),
            selectedProduct
        });

        return res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (err) {
        console.error('Outfit recommendation error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate outfit recommendations'
        });
    }
};
