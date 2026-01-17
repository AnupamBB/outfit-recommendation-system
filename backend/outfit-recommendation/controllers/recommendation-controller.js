const { getRecommendations } = require('../models/recommendation-model');

exports.health = async (req, res) => {
    return res.status(200).json({
        status: 'ok',
        service: 'outfit-recommendation'
    });
};

exports.recommend = async (req, res) => {
    try {
        const data = await getRecommendations(req.body);

        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
