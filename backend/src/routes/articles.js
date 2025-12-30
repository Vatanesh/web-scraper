const express = require('express');
const router = express.Router();
const {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    scrapeAndStoreArticles
} = require('../controllers/articleController');
const { optimizeArticleById } = require('../controllers/optimizationController');

// Scraping route
router.post('/scrape', scrapeAndStoreArticles);

// Optimization route
router.post('/:id/optimize', optimizeArticleById);

// CRUD routes
router.post('/', createArticle);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

module.exports = router;
