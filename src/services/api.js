import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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

export default api;
