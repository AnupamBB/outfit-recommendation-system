require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const RecommendationSchema = require('../schemas/recommendation-schema');

const Recommendation = mongoose.model('Recommendation', RecommendationSchema, 'recommendations');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Excel file path
const filePath = path.join(__dirname, 'Sample_Products.xlsx');

// Reading Excel file
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

const COLORS = {
    'red': ['red', 'crimson', 'burgundy', 'cherry', 'ruby', 'maroon', 'wine'],
    'blue': ['blue', 'navy', 'azure', 'cobalt', 'teal', 'indigo', 'denim'],
    'green': ['green', 'olive', 'mint', 'emerald', 'lime', 'sage'],
    'yellow': ['yellow', 'gold', 'mustard', 'lemon'],
    'black': ['black', 'ebony', 'jet', 'charcoal'],
    'white': ['white', 'ivory', 'cream', 'pearl'],
    'grey': ['grey', 'gray', 'silver', 'slate', 'ash'],
    'brown': ['brown', 'tan', 'beige', 'khaki', 'camel', 'chocolate'],
    'purple': ['purple', 'violet', 'lavender', 'plum', 'magenta'],
    'pink': ['pink', 'rose', 'coral', 'fuchsia', 'salmon', 'peach'],
    'orange': ['orange', 'rust', 'amber', 'tangerine']
};

const extractColor = (text) => {
    if (!text) return 'neutral';
    const lower = text.toLowerCase();

    for (const [mainColor, variations] of Object.entries(COLORS)) {
        if (variations.some(v => lower.includes(v))) {
            return mainColor;
        }
    }
    return 'neutral';
};

const importData = async () => {
    try {
        for (const product of products) {
            // Combining all text fields for better color detection
            const fullText = `${product.title} ${product.description} ${product.tags} ${product.color || ''}`;
            const detectedColor = extractColor(fullText);

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
                primary_color: detectedColor
            };

            await Recommendation.updateOne(
                { sku_id: doc.sku_id },
                { $set: doc },
                { upsert: true }
            );
        }

        console.log('Excel data imported successfully!');
    }
    catch (err) {
        console.error('Error importing Excel:', err);
    }
    finally {
        mongoose.disconnect();
    }
};

importData();