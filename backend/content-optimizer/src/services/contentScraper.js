const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape article content from a URL
 * @param {string} url - URL of the article
 * @returns {Promise<Object>} - Scraped article data
 */
const scrapeArticleContent = async (url) => {
    try {
        console.log(`Scraping content from: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        const html = response.data;
        const content = cleanContent(html);

        console.log(`Successfully scraped ${content.title}`);
        return {
            title: content.title,
            url: url,
            content: content.text
        };

    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
};

/**
 * Clean and extract main content from HTML
 * @param {string} html - Raw HTML
 * @returns {Object} - Extracted title and text
 */
const cleanContent = (html) => {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .navigation, .comments, .sidebar, .ads, .advertisement').remove();

    // Extract title
    const title = $('h1').first().text().trim() ||
        $('title').text().trim() ||
        'Untitled';

    // Try multiple content selectors
    let text = '';
    const contentSelectors = [
        'article',
        '[role="main"]',
        'main',
        '.post-content',
        '.entry-content',
        '.article-content',
        '.content',
        'body'
    ];

    for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
            // Get text from paragraphs and headings
            const paragraphs = element.find('p, h1, h2, h3, h4, li').map((i, el) => {
                return $(el).text().trim();
            }).get().filter(p => p.length > 20); // Filter out very short text

            text = paragraphs.join('\n\n');

            if (text.length > 500) break; // Found good content
        }
    }

    // Fallback: get all paragraphs
    if (text.length < 500) {
        text = $('p').map((i, el) => $(el).text().trim())
            .get()
            .filter(p => p.length > 20)
            .join('\n\n');
    }

    return {
        title,
        text: text.substring(0, 10000) // Limit to 10k chars to avoid token limits
    };
};

module.exports = {
    scrapeArticleContent,
    cleanContent
};
