const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// Target articles identified from BeyondChats blog
const TARGET_ARTICLES = [
    'https://beyondchats.com/blogs/google-ads-are-you-wasting-your-money-on-clicks/',
    'https://beyondchats.com/blogs/should-you-trust-ai-in-healthcare/',
    'https://beyondchats.com/blogs/why-we-are-building-yet-another-ai-chatbot/',
    'https://beyondchats.com/blogs/will-ai-understand-the-complexities-of-patient-care/',
    'https://beyondchats.com/blogs/choosing-the-right-ai-chatbot-a-guide/'
];

/**
 * Scrape a single article from a URL using Puppeteer (for JS-rendered content)
 * @param {string} url - The URL of the article to scrape
 * @returns {Promise<Object>} - Scraped article data
 */
const scrapeArticle = async (url) => {
    let browser;
    try {
        console.log(`Scraping article with Puppeteer: ${url}`);

        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ]
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        // Navigate and wait for content
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for article content to load
        await page.waitForSelector('article, .post-content, main', { timeout: 10000 }).catch(() => { });

        // Get the rendered HTML
        const html = await page.content();
        const $ = cheerio.load(html);

        // Extract article data
        const articleData = extractContent($, url);

        console.log(`Successfully scraped: ${articleData.title}`);
        return articleData;

    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

/**
 * Extract content from HTML using Cheerio
 * @param {CheerioAPI} $ - Cheerio instance
 * @param {string} url - Article URL
 * @returns {Object} - Extracted article data
 */
const extractContent = ($, url) => {
    // Extract title
    const title = $('h1').first().text().trim() ||
        $('title').text().trim() ||
        'Untitled Article';

    // Extract main content - try multiple selectors
    let content = '';

    // First, try to find the main article body
    const articleBody = $('article .entry-content, article .post-content, .single-post-content, .blog-post-content');

    if (articleBody.length > 0) {
        // Remove unwanted elements
        articleBody.find('script, style, nav, footer, .navigation, .comments, .sidebar, .related-posts, .share-buttons, aside, .comment-form').remove();

        // Get all paragraphs from the article
        const paragraphs = articleBody.find('p').map((i, el) => {
            const text = $(el).text().trim();
            // Filter out short paragraphs that are likely navigation/metadata
            return text.length > 50 ? text : null;
        }).get().filter(Boolean);

        content = paragraphs.join('\n\n');
    }

    // Fallback: extract all meaningful paragraph text from the page
    if (!content || content.length < 200) {
        const allParagraphs = $('p').map((i, el) => {
            const text = $(el).text().trim();
            // Only include substantial paragraphs
            if (text.length > 50 &&
                !text.includes('Comment') &&
                !text.includes('Share') &&
                !text.includes('Follow us')) {
                return text;
            }
            return null;
        }).get().filter(Boolean);

        content = allParagraphs.join('\n\n');
    }

    // Extract excerpt (first 200 characters of content)
    const excerpt = content.substring(0, 200).trim() + '...';

    // Extract author if available
    const author = $('.author-name').first().text().trim() ||
        $('.author').first().text().trim() ||
        $('[rel="author"]').first().text().trim() ||
        $('meta[name="author"]').attr('content') ||
        'BeyondChats';

    // Extract published date if available
    let publishedDate = null;
    const dateText = $('time').first().attr('datetime') ||
        $('.published').first().text().trim() ||
        $('.post-date').first().text().trim() ||
        $('meta[property="article:published_time"]').attr('content');

    if (dateText) {
        publishedDate = new Date(dateText);
    }

    return {
        title,
        url,
        content,
        excerpt,
        author,
        publishedDate,
        metadata: {
            scrapedFrom: 'BeyondChats Blog',
            wordCount: content.split(/\s+/).length
        }
    };
};

/**
 * Scrape all target BeyondChats articles
 * @returns {Promise<Array>} - Array of scraped articles
 */
const scrapeBeyondChatsArticles = async () => {
    console.log(`Starting to scrape ${TARGET_ARTICLES.length} articles...`);

    const articles = [];

    for (const url of TARGET_ARTICLES) {
        try {
            const article = await scrapeArticle(url);
            articles.push(article);

            // Be polite - wait 1 second between requests
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`Failed to scrape ${url}:`, error.message);
            // Continue with other articles
        }
    }

    console.log(`Successfully scraped ${articles.length} articles`);
    return articles;
};

module.exports = {
    scrapeArticle,
    scrapeBeyondChatsArticles,
    TARGET_ARTICLES
};
