const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const articleRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://articles-beyondchats.vercel.app']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'BeyondChats Article Scraper API',
        version: '1.0.0',
        endpoints: {
            articles: '/api/articles',
            scrape: '/api/articles/scrape'
        }
    });
});

app.use('/api/articles', articleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/articles`);
});

module.exports = app;
