const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all articles from the backend API
 * @param {boolean} isOptimized - Filter by optimization status
 * @returns {Promise<Array>} - Array of articles
 */
const fetchAllArticles = async (isOptimized = false) => {
    try {
        const response = await axios.get(`${API_URL}/articles`, {
            params: {
                isOptimized,
                limit: 100 // Get all articles
            }
        });

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch articles');
        }
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        throw error;
    }
};

/**
 * Fetch a single article by ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} - Article object
 */
const fetchArticleById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/articles/${id}`);

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error('Article not found');
        }
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error.message);
        throw error;
    }
};

module.exports = {
    fetchAllArticles,
    fetchArticleById
};
