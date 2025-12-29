const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        trim: true
    },
    publishedDate: {
        type: Date
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    },
    isOptimized: {
        type: Boolean,
        default: false
    },
    originalArticleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        default: null
    },
    references: [{
        title: {
            type: String,
            trim: true
        },
        url: {
            type: String,
            trim: true
        }
    }],
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Index for faster queries
articleSchema.index({ isOptimized: 1 });
articleSchema.index({ url: 1 });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
