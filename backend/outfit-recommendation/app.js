require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const recommendationRoutes = require('./routes/recommendation-routes');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/recommendation', recommendationRoutes);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "outfit-recommendation",
        message: "Outfit Recommendation service is running"
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Outfit Recommendation service running on port ${PORT}`);
});