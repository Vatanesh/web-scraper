const Article = require('../models/Article');

/**
 * Optimize a single article
 * POST /api/articles/:id/optimize
 */
const optimizeArticleById = async (req, res) => {
    try {
        const articleId = req.params.id;

        // Step 1: Fetch the original article
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        // Check if already optimized
        if (article.isOptimized) {
            return res.status(400).json({
                success: false,
                error: 'This article is already optimized'
            });
        }

        // Check if optimization already exists for this article
        const existingOptimized = await Article.findOne({
            originalArticleId: articleId,
            isOptimized: true
        });

        if (existingOptimized) {
            return res.status(200).json({
                success: true,
                message: 'Optimized version already exists',
                data: existingOptimized
            });
        }

        console.log(`Starting optimization for: ${article.title}`);

        // Dynamically import content-optimizer services
        const { searchGoogle, extractTopTwoLinks } = require('../../../content-optimizer/src/services/googleSearch');
        const { scrapeArticleContent } = require('../../../content-optimizer/src/services/contentScraper');
        const { optimizeArticle } = require('../../../content-optimizer/src/services/llmOptimizer');

        // Step 2: Search Google for article title
        console.log('Searching Google for top-ranking articles...');
        const searchResults = await searchGoogle(article.title);
        const topTwoLinks = extractTopTwoLinks(searchResults);

        if (topTwoLinks.length < 2) {
            return res.status(500).json({
                success: false,
                error: 'Could not find enough reference articles from Google search'
            });
        }

        console.log(`Found ${topTwoLinks.length} reference articles`);

        // Step 3: Scrape content from reference articles
        console.log('Scraping content from reference articles...');
        const referenceArticles = [];

        for (const url of topTwoLinks) {
            const scraped = await scrapeArticleContent(url);
            if (scraped) {
                referenceArticles.push(scraped);
            }
            // Small delay between scrapes
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (referenceArticles.length === 0) {
            return res.status(500).json({
                success: false,
                error: 'Failed to scrape reference articles'
            });
        }

        console.log(`Scraped ${referenceArticles.length} reference articles`);

        // Step 4: Optimize content using LLM
        console.log('Optimizing article content with LLM...');
        const optimizedContent = await optimizeArticle(article, referenceArticles);
        console.log('Article optimized successfully');

        // Step 5: Create and save optimized article
        console.log('Saving optimized article...');

        // Format references for citation
        const formattedReferences = referenceArticles.map(ref => ({
            title: ref.title,
            url: ref.url
        }));

        // Create new article object
        const optimizedArticle = new Article({
            title: `${article.title} (Optimized)`,
            url: `${article.url}?optimized=true`,
            content: optimizedContent,
            excerpt: optimizedContent.substring(0, 200) + '...',
            author: article.author,
            publishedDate: article.publishedDate,
            isOptimized: true,
            originalArticleId: article._id,
            references: formattedReferences,
            metadata: {
                optimizedAt: new Date().toISOString(),
                llmModel: 'llama-3.3-70b-versatile',
                referenceCount: formattedReferences.length
            }
        });

        const savedArticle = await optimizedArticle.save();
        console.log('✓ Optimized article saved successfully');

        res.status(201).json({
            success: true,
            message: 'Article optimized successfully',
            data: savedArticle
        });

    } catch (error) {
        console.error('Error optimizing article:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to optimize article'
        });
    }
};

module.exports = {
    optimizeArticleById
};
