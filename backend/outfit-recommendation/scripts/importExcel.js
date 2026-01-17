require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const RecommendationSchema = require('../schemas/recommendation-schema');

const Recommendation = mongoose.model('Recommendation', RecommendationSchema, 'recommendations');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Path to your Excel file (relative to this script)
const filePath = path.join(__dirname, 'Sample_Products.xlsx');

// Read Excel file
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const products = xlsx.utils.sheet_to_json(sheet);

const parseTags = (tagsStr) => {
    try {
        return JSON.parse(tagsStr.replace(/'/g, '"'));
    }
    catch {
        return [];
    }
};

const importData = async () => {
    try {
        for (const product of products) {
            const doc = {
                sku_id: product.sku_id || '',
                title: product.title || '',
                sector: product.sector || '',
                lowest_price: Number(product.lowest_price) || 0,
                brand_name: product.brand_name || '',
                category: product.category || '',
                sub_category: product.sub_category || '',
                product_type: product.product_type || '',
                gender: product.gender || '',
                description: product.description || '',
                tags: parseTags(product.tags || '[]'),
                featured_image: product.featured_image || '',
                style: product.style || 'casual',
                season: product.season || 'all',
                occasion: product.occasion || 'casual',
            };

            await Recommendation.updateOne(
                { sku_id: doc.sku_id },
                { $set: doc },
                { upsert: true }
            );
        }

        console.log('✅ Excel data imported successfully!');
    }
    catch (err) {
        console.error('❌ Error importing Excel:', err);
    }
    finally {
        mongoose.disconnect();
    }
};

importData();