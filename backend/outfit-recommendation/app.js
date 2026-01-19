require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const recommendationRoutes = require('./routes/recommendation-routes');

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/recommendation', recommendationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Outfit Recommendation service running on port ${PORT}`);
});