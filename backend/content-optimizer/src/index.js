require('dotenv').config();
const { fetchAllArticles } = require('./services/articleFetcher');
const { searchGoogle, extractTopTwoLinks } = require('./services/googleSearch');
const { scrapeArticleContent } = require('./services/contentScraper');
const { optimizeArticle } = require('./services/llmOptimizer');
const { publishOptimizedArticle } = require('./services/articlePublisher');
const log = require('./utils/logger');

/**
 * Main orchestration function
 */
const main = async () => {
    try {
        log.divider();
        log.info('Content Optimization Script Started');
        log.divider();

        // Step 1: Fetch original articles from API
        log.info('Step 1: Fetching original articles from backend...');
        const articles = await fetchAllArticles(false); // Get only non-optimized articles

        if (!articles || articles.length === 0) {
            log.warning('No articles found. Please run the scraper first.');
            return;
        }

        log.success(`Found ${articles.length} original articles`);
        log.divider();

        // Process each article (or just the first one for demo)
        const articlesToProcess = articles.slice(0, 1); // Process 1 article for demo
        log.info(`Processing ${articlesToProcess.length} article(s)...`);

        for (const article of articlesToProcess) {
            try {
                log.divider();
                log.info(`Processing: ${article.title}`);

                // Step 2: Search Google for article title
                log.info('Step 2: Searching Google for top-ranking articles...');
                const searchResults = await searchGoogle(article.title);
                const topTwoLinks = extractTopTwoLinks(searchResults);

                if (topTwoLinks.length < 2) {
                    log.warning('Could not find enough reference articles. Skipping...');
                    continue;
                }

                log.success(`Found ${topTwoLinks.length} reference articles`);

                // Step 3: Scrape content from reference articles
                log.info('Step 3: Scraping content from reference articles...');
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
                    log.warning('Failed to scrape reference articles. Skipping...');
                    continue;
                }

                log.success(`Scraped ${referenceArticles.length} reference articles`);

                // Step 4: Optimize content using LLM
                log.info('Step 4: Optimizing article content with LLM...');
                const optimizedContent = await optimizeArticle(article, referenceArticles);
                log.success('Article optimized successfully');

                // Step 5: Publish optimized article
                log.info('Step 5: Publishing optimized article...');
                const published = await publishOptimizedArticle(article, optimizedContent, referenceArticles);
                log.success(`Published: ${published.title}`);

                log.divider();
                log.success(`✨ Successfully completed optimization for: ${article.title}`);

            } catch (error) {
                log.error(`Error processing article "${article.title}": ${error.message}`);
                continue; // Continue with next article
            }
        }

        log.divider();
        log.success('Content optimization completed!');
        log.divider();

    } catch (error) {
        log.error(`Fatal error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

// Run the script
if (require.main === module) {
    main();
}

module.exports = { main };
