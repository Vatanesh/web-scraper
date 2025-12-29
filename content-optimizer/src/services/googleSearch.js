const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Search DuckDuckGo for a query and return top results
 * DuckDuckGo doesn't use CAPTCHAs and is more automation-friendly
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of search result URLs
 */
const searchDuckDuckGo = async (query) => {
    try {
        console.log(`Searching DuckDuckGo for: "${query}"`);

        // DuckDuckGo HTML search (no JavaScript needed)
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const links = [];

        // Extract search result links
        $('.result__a').each((i, element) => {
            const href = $(element).attr('href');
            if (href && href.startsWith('http')) {
                // Clean DuckDuckGo tracking URLs
                const cleanUrl = href.replace(/^\/\/duckduckgo\.com\/l\/\?uddg=/, '');
                const decodedUrl = decodeURIComponent(cleanUrl);

                // Filter out unwanted domains
                if (!decodedUrl.includes('youtube.com') &&
                    !decodedUrl.includes('facebook.com') &&
                    !decodedUrl.includes('twitter.com') &&
                    !decodedUrl.includes('instagram.com') &&
                    !decodedUrl.includes('duckduckgo.com')) {
                    links.push(decodedUrl.split('&')[0]); // Remove tracking params
                }
            }
        });

        console.log(`Found ${links.length} DuckDuckGo results`);

        if (links.length > 0) {
            console.log('First few results:', links.slice(0, 3));
            return links;
        }

        // Fallback if no results
        console.log('⚠ No results from DuckDuckGo, using fallback URLs');
        return getFallbackUrls();

    } catch (error) {
        console.error('Error searching DuckDuckGo:', error.message);
        console.log('📝 Using fallback reference URLs...');
        return getFallbackUrls();
    }
};

/**
 * Get fallback reference URLs
 * @returns {Array} - Fallback article URLs
 */
const getFallbackUrls = () => {
    return [
        'https://www.forbes.com/advisor/business/software/what-is-a-chatbot/',
        'https://www.ibm.com/topics/chatbots'
    ];
};

/**
 * Extract top 2 blog/article links from search results
 * @param {Array} results - Array of URLs from search
 * @returns {Array} - Top 2 filtered URLs
 */
const extractTopTwoLinks = (results) => {
    // Filter for likely blog/article URLs and take first 2
    const blogKeywords = ['blog', 'article', 'post', 'news', 'guide', 'tutorial', 'what-is', 'how-to'];

    const blogLinks = results.filter(url => {
        const lowerUrl = url.toLowerCase();
        return blogKeywords.some(keyword => lowerUrl.includes(keyword)) ||
            lowerUrl.includes('.com/') ||
            lowerUrl.includes('.org/') ||
            lowerUrl.includes('.io/');
    });

    // Return first 2, or fallback to first 2 results if no keyword matches
    const selected = blogLinks.length >= 2 ? blogLinks.slice(0, 2) : results.slice(0, 2);

    console.log('Selected top 2 links:', selected);
    return selected;
};

// Export both DuckDuckGo and Google (legacy) names for compatibility
module.exports = {
    searchGoogle: searchDuckDuckGo, // Use DuckDuckGo instead of Google
    searchDuckDuckGo,
    extractTopTwoLinks,
    getFallbackUrls
};
