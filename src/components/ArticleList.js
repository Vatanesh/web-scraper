import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../services/api';
import '../styles/articles.css';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'original', 'optimized'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadArticles();
    }, [filter]);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const params = {};

            if (filter === 'original') {
                params.isOptimized = 'false';
            } else if (filter === 'optimized') {
                params.isOptimized = 'true';
            }

            const data = await fetchArticles(params);
            setArticles(data);
        } catch (error) {
            console.error('Failed to load articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="article-list-container">
            <div className="header">
                <h1>📚 BeyondChats Articles</h1>
                <p className="subtitle">Original and AI-optimized content</p>
            </div>

            <div className="controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-tabs">
                    <button
                        className={`tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Articles
                    </button>
                    <button
                        className={`tab ${filter === 'original' ? 'active' : ''}`}
                        onClick={() => setFilter('original')}
                    >
                        Original
                    </button>
                    <button
                        className={`tab ${filter === 'optimized' ? 'active' : ''}`}
                        onClick={() => setFilter('optimized')}
                    >
                        Optimized
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading articles...</p>
                </div>
            ) : filteredArticles.length === 0 ? (
                <div className="empty-state">
                    <p>📭 No articles found</p>
                    <p className="hint">Try adjusting your filters or search term</p>
                </div>
            ) : (
                <div className="articles-grid">
                    {filteredArticles.map(article => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ArticleCard = ({ article }) => {
    return (
        <Link to={`/article/${article._id}`} className="article-card">
            <div className="card-header">
                {article.isOptimized && (
                    <span className="badge optimized">✨ Optimized</span>
                )}
                {!article.isOptimized && (
                    <span className="badge original">📄 Original</span>
                )}
            </div>

            <h3 className="article-title">{article.title}</h3>

            <p className="article-excerpt">{article.excerpt}</p>

            <div className="card-footer">
                <div className="author">
                    <span className="author-icon">👤</span>
                    <span>{article.author || 'BeyondChats'}</span>
                </div>

                {article.isOptimized && article.references && (
                    <div className="references-count">
                        {article.references.length} references
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ArticleList;
