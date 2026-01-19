const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    sku_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sector: { type: String },
    lowest_price: { type: Number, default: 0 },
    brand_name: { type: String },
    category: { type: String },
    sub_category: { type: String },
    product_type: { type: String },
    gender: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    featured_image: { type: String },
    style: { type: String, default: 'casual' },
    season: { type: String, default: 'all' },
    occasion: { type: String, default: 'casual' },
    primary_color: { type: String, default: 'neutral' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = RecommendationSchema;