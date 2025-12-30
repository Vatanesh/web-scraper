import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000, // 2 minutes to allow for optimization process
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Fetch all articles with optional filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Array of articles
 */
export const fetchArticles = async (params = {}) => {
    try {
        const response = await api.get('/articles', { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

/**
 * Fetch a single article by ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} - Article object
 */
export const fetchArticleById = async (id) => {
    try {
        const response = await api.get(`/articles/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching article:', error);
        throw error;
    }
};

/**
 * Trigger optimization for an article
 * @param {string} id - Article ID
 * @returns {Promise<Object>} - Optimized article object
 */
export const optimizeArticle = async (id) => {
    try {
        const response = await api.post(`/articles/${id}/optimize`);
        return response.data.data;
    } catch (error) {
        console.error('Error optimizing article:', error);
        throw error;
    }
};

export default api;
