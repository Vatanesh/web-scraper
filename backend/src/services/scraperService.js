const axios = require('axios');
const cheerio = require('cheerio');

// Target articles identified from BeyondChats blog
const TARGET_ARTICLES = [
    'https://beyondchats.com/blogs/google-ads-are-you-wasting-your-money-on-clicks/',
    'https://beyondchats.com/blogs/should-you-trust-ai-in-healthcare/',
    'https://beyondchats.com/blogs/why-we-are-building-yet-another-ai-chatbot/',
    'https://beyondchats.com/blogs/will-ai-understand-the-complexities-of-patient-care/',
    'https://beyondchats.com/blogs/choosing-the-right-ai-chatbot-a-guide/'
];

/**
 * Scrape a single article from a URL
 * @param {string} url - The URL of the article to scrape
 * @returns {Promise<Object>} - Scraped article data
 */
const scrapeArticle = async (url) => {
    try {
        console.log(`Scraping article: ${url}`);

        // Fetch the HTML content
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Extract article data
        const articleData = extractContent($, url);

        console.log(`Successfully scraped: ${articleData.title}`);
        return articleData;

    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        throw error;
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
    const contentSelectors = [
        'article',
        '.post-content',
        '.entry-content',
        '.article-content',
        'main',
        '.content'
    ];

    for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
            // Remove script, style, nav, footer elements
            element.find('script, style, nav, footer, .navigation, .comments').remove();
            content = element.text().trim();
            if (content.length > 100) break; // Good enough content found
        }
    }

    // Fallback: extract all paragraph text
    if (!content || content.length < 100) {
        content = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');
    }

    // Extract excerpt (first 200 characters of content)
    const excerpt = content.substring(0, 200).trim() + '...';

    // Extract author if available
    const author = $('.author').first().text().trim() ||
        $('[rel="author"]').first().text().trim() ||
        $('meta[name="author"]').attr('content') ||
        'BeyondChats';

    // Extract published date if available
    let publishedDate = null;
    const dateText = $('time').first().attr('datetime') ||
        $('.published').first().text().trim() ||
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
