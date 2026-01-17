const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    sku_id: { type: String, required: true, unique: true },       // unique product code
    title: { type: String, required: true },                       // product name/title
    sector: { type: String },                                      // optional sector/department
    lowest_price: { type: Number, default: 0 },                    // price for budget filtering
    brand_name: { type: String },                                   // brand
    category: { type: String },                                     // main category, e.g., top/bottom/shoes
    sub_category: { type: String },                                 // e.g., shirt, jeans
    product_type: { type: String },                                  // optional product type
    gender: { type: String },                                       // male/female/unisex
    description: { type: String },                                   // product description
    tags: [{ type: String }],                                        // array of tags
    featured_image: { type: String },                                // image URL
    style: { type: String, default: 'casual' },                     // casual/formal/etc.
    season: { type: String, default: 'all' },                       // winter/summer/all
    occasion: { type: String, default: 'casual' },                  // casual/formal/etc.
    createdAt: { type: Date, default: Date.now }
});

module.exports = RecommendationSchema;