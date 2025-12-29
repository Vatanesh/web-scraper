const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

/**
 * Publish optimized article to backend API
 * @param {Object} originalArticle - Original article object
 * @param {string} optimizedContent - Optimized content from LLM
 * @param {Array} references - Reference articles used
 * @returns {Promise<Object>} - Published article
 */
const publishOptimizedArticle = async (originalArticle, optimizedContent, references) => {
    try {
        console.log(`Publishing optimized version of: ${originalArticle.title}`);

        // Format references for citation
        const formattedReferences = references.map(ref => ({
            title: ref.title,
            url: ref.url
        }));

        // Add citation section at the bottom
        const contentWithCitations = `${optimizedContent}

---

## References

This article was optimized based on analysis of the following top-ranking articles:

${formattedReferences.map((ref, index) =>
            `${index + 1}. [${ref.title}](${ref.url})`
        ).join('\n')}

*Original article: [${originalArticle.title}](${originalArticle.url})*
`;

        // Create new article object
        const optimizedArticle = {
            title: `${originalArticle.title} (Optimized)`,
            url: `${originalArticle.url}?optimized=true`,
            content: contentWithCitations,
            excerpt: optimizedContent.substring(0, 200) + '...',
            author: originalArticle.author,
            publishedDate: originalArticle.publishedDate,
            isOptimized: true,
            originalArticleId: originalArticle._id,
            references: formattedReferences,
            metadata: {
                optimizedAt: new Date().toISOString(),
                llmModel: 'gemini-pro',
                referenceCount: formattedReferences.length
            }
        };

        // POST to API
        const response = await axios.post(`${API_URL}/articles`, optimizedArticle);

        if (response.data.success) {
            console.log('✓ Optimized article published successfully');
            return response.data.data;
        } else {
            throw new Error('Failed to publish article');
        }

    } catch (error) {
        console.error('Error publishing article:', error.message);
        throw error;
    }
};

module.exports = {
    publishOptimizedArticle
};
