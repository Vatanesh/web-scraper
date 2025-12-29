import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchArticleById } from '../services/api';
import '../styles/articles.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadArticle();
    }, [id]);

    const loadArticle = async () => {
        try {
            setLoading(true);
            const data = await fetchArticleById(id);
            setArticle(data);
        } catch (err) {
            setError('Failed to load article');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="article-detail-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="article-detail-container">
                <div className="error-state">
                    <p>❌ {error || 'Article not found'}</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        ← Back to articles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="article-detail-container">
            <div className="article-detail-header">
                <button onClick={() => navigate('/')} className="back-button">
                    ← Back to articles
                </button>

                <div className="article-badges">
                    {article.isOptimized ? (
                        <span className="badge optimized large">✨ Optimized Version</span>
                    ) : (
                        <span className="badge original large">📄 Original Article</span>
                    )}
                </div>
            </div>

            <article className="article-content">
                <h1 className="article-title-detail">{article.title}</h1>

                <div className="article-meta">
                    <div className="meta-item">
                        <span className="meta-icon">👤</span>
                        <span>{article.author || 'BeyondChats'}</span>
                    </div>

                    {article.publishedDate && (
                        <div className="meta-item">
                            <span className="meta-icon">📅</span>
                            <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                        </div>
                    )}

                    {article.isOptimized && article.originalArticleId && (
                        <div className="meta-item">
                            <Link to={`/article/${article.originalArticleId._id}`} className="original-link">
                                View Original Article →
                            </Link>
                        </div>
                    )}
                </div>

                <div className="article-body">
                    {formatContent(article.content)}
                </div>

                {article.isOptimized && article.references && article.references.length > 0 && (
                    <div className="references-section">
                        <h2>📚 References</h2>
                        <p className="references-intro">
                            This article was optimized based on analysis of these top-ranking articles:
                        </p>
                        <ul className="references-list">
                            {article.references.map((ref, index) => (
                                <li key={index}>
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="reference-link">
                                        {ref.title}
                                        <span className="external-icon">↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!article.isOptimized && (
                    <div className="article-footer">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="source-link">
                            View original source ↗
                        </a>
                    </div>
                )}
            </article>
        </div>
    );
};

// Helper function to format content (markdown-like)
const formatContent = (content) => {
    if (!content) return null;

    // Helper to convert inline markdown (bold, italic)
    const formatInlineMarkdown = (text) => {
        // Replace **bold** with <strong>bold</strong>
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Replace *italic* with <em>italic</em>
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        return text;
    };

    // Split by paragraphs and format
    const lines = content.split('\n');
    const elements = [];

    lines.forEach((line, index) => {
        line = line.trim();
        if (!line) return;

        // Headings
        if (line.startsWith('###')) {
            const text = formatInlineMarkdown(line.replace(/^###\s*/, ''));
            elements.push(<h3 key={index} dangerouslySetInnerHTML={{ __html: text }} />);
        } else if (line.startsWith('##')) {
            const text = formatInlineMarkdown(line.replace(/^##\s*/, ''));
            elements.push(<h2 key={index} dangerouslySetInnerHTML={{ __html: text }} />);
        } else if (line.startsWith('#')) {
            const text = formatInlineMarkdown(line.replace(/^#\s*/, ''));
            elements.push(<h2 key={index} dangerouslySetInnerHTML={{ __html: text }} />);
        }
        // List items
        else if (line.startsWith('- ')) {
            const text = formatInlineMarkdown(line.replace(/^-\s*/, ''));
            elements.push(<li key={index} dangerouslySetInnerHTML={{ __html: text }} />);
        }
        // Horizontal rule
        else if (line.startsWith('---')) {
            elements.push(<hr key={index} />);
        }
        // Paragraphs
        else {
            const text = formatInlineMarkdown(line);
            elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: text }} />);
        }
    });

    return <div>{elements}</div>;
};

export default ArticleDetail;
