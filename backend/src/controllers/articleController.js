const Article = require('../models/Article');
const { scrapeBeyondChatsArticles } = require('../services/scraperService');

/**
 * Create a new article
 * POST /api/articles
 */
const createArticle = async (req, res) => {
    try {
        const article = new Article(req.body);
        const savedArticle = await article.save();

        res.status(201).json({
            success: true,
            data: savedArticle
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Get all articles with optional filtering and pagination
 * GET /api/articles?isOptimized=false&page=1&limit=10
 */
const getAllArticles = async (req, res) => {
    try {
        const { isOptimized, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter = {};
        if (isOptimized !== undefined) {
            filter.isOptimized = isOptimized === 'true';
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch articles
        const articles = await Article.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('originalArticleId', 'title url');

        // Get total count for pagination
        const total = await Article.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: articles,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Get a single article by ID
 * GET /api/articles/:id
 */
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('originalArticleId', 'title url content');

        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Update an article
 * PUT /api/articles/:id
 */
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Delete an article
 * DELETE /api/articles/:id
 */
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Scrape and store BeyondChats articles
 * POST /api/articles/scrape
 */
const scrapeAndStoreArticles = async (req, res) => {
    try {
        console.log('Starting scraping process...');
        const scrapedData = await scrapeBeyondChatsArticles();

        const savedArticles = [];
        const errors = [];

        for (const data of scrapedData) {
            try {
                // Check if article already exists
                const existing = await Article.findOne({ url: data.url });

                if (existing) {
                    console.log(`Article already exists: ${data.title}`);
                    savedArticles.push(existing);
                } else {
                    const article = new Article(data);
                    const saved = await article.save();
                    savedArticles.push(saved);
                    console.log(`Saved new article: ${data.title}`);
                }
            } catch (error) {
                errors.push({
                    url: data.url,
                    error: error.message
                });
            }
        }

        res.status(201).json({
            success: true,
            message: `Scraped and stored ${savedArticles.length} articles`,
            data: savedArticles,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    scrapeAndStoreArticles
};
