const Groq = require('groq-sdk');
require('dotenv').config();

// Initialize Groq API
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Optimize article content using LLM (Groq/Llama 3)
 * @param {Object} originalArticle - Original article object
 * @param {Array} referenceArticles - Array of reference articles
 * @returns {Promise<string>} - Optimized article content
 */
const optimizeArticle = async (originalArticle, referenceArticles) => {
    try {
        console.log(`Optimizing article: ${originalArticle.title}`);

        // Prepare the prompt
        const prompt = createOptimizationPrompt(originalArticle, referenceArticles);

        // Use Llama 3.3 70B model via Groq (Free & Fast)
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 8192,
        });

        const optimizedContent = completion.choices[0]?.message?.content || '';

        console.log('Article optimized successfully');
        return optimizedContent;

    } catch (error) {
        console.error('Error optimizing article:', error.message);
        throw error;
    }
};

/**
 * Create optimization prompt for the LLM
 * @param {Object} originalArticle - Original article
 * @param {Array} referenceArticles - Reference articles
 * @returns {string} - Formatted prompt
 */
const createOptimizationPrompt = (originalArticle, referenceArticles) => {
    const ref1 = referenceArticles[0] || { title: 'N/A', content: '' };
    const ref2 = referenceArticles[1] || { title: 'N/A', content: '' };

    return `You are a professional content optimizer and SEO expert. Your task is to improve an article by analyzing top-ranking content on Google and applying their successful formatting and writing patterns.

**ORIGINAL ARTICLE:**
Title: ${originalArticle.title}
Content:
${originalArticle.content.substring(0, 3000)}

**REFERENCE ARTICLE 1 (Top-ranking on Google):**
Title: ${ref1.title}
Content:
${ref1.content.substring(0, 2000)}

**REFERENCE ARTICLE 2 (Top-ranking on Google):**
Title: ${ref2.title}
Content:
${ref2.content.substring(0, 2000)}

**YOUR TASK:**
Rewrite the ORIGINAL ARTICLE by incorporating the formatting style, structure, and content patterns from the two reference articles that are currently ranking on top of Google search results.

**REQUIREMENTS:**
1. **Maintain Core Message**: Keep all factual information and key points from the original article
2. **Improve Structure**: Use heading hierarchy, bullet points, and formatting similar to reference articles
3. **Enhance Readability**: Make the content more scannable and engaging
4. **SEO Optimization**: Incorporate relevant keywords and phrases naturally
5. **Similar Length**: Keep similar length to the original (don't make it too short or too long)
6. **Professional Tone**: Maintain a professional, authoritative tone
7. **Formatting**: Use markdown formatting (headings with ##, ### and bullet points with -)

**OUTPUT FORMAT:**
Provide ONLY the optimized article content in markdown format. Do NOT include any meta-commentary, explanations, or notes. Just the article itself.

Begin the optimized article now:`;
};

module.exports = {
    optimizeArticle
};
