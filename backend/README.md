# BeyondChats Backend API

Backend server for scraping and managing BeyondChats blog articles with full CRUD API.

## Features

- ✅ Web scraping of BeyondChats blog articles
- ✅ MongoDB database storage
- ✅ RESTful CRUD API
- ✅ Support for original and optimized articles
- ✅ Reference tracking for optimized content

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your MongoDB URI if needed
```

## Usage

### Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Start Production Server

```bash
npm start
```

## API Endpoints

### Base URL
`http://localhost:5000/api/articles`

### Endpoints

#### 1. Scrape BeyondChats Articles
```http
POST /api/articles/scrape
```
Scrapes the 5 target articles from BeyondChats blog and stores them in the database.

**Response:**
```json
{
  "success": true,
  "message": "Scraped and stored 5 articles",
  "data": [...]
}
```

#### 2. Get All Articles
```http
GET /api/articles?isOptimized=false&page=1&limit=10
```

**Query Parameters:**
- `isOptimized` (optional): Filter by optimized status (true/false)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

#### 3. Get Single Article
```http
GET /api/articles/:id
```

#### 4. Create Article
```http
POST /api/articles
Content-Type: application/json

{
  "title": "Article Title",
  "url": "https://example.com/article",
  "content": "Article content...",
  "excerpt": "Brief excerpt...",
  "author": "Author Name"
}
```

#### 5. Update Article
```http
PUT /api/articles/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### 6. Delete Article
```http
DELETE /api/articles/:id
```

## Article Schema

```javascript
{
  title: String,
  url: String (unique),
  content: String,
  excerpt: String,
  author: String,
  publishedDate: Date,
  scrapedAt: Date,
  isOptimized: Boolean,
  originalArticleId: ObjectId,
  references: [{ title, url }],
  metadata: Object
}
```

## Testing

### Using curl

```bash
# Scrape articles
curl -X POST http://localhost:5000/api/articles/scrape

# Get all articles
curl http://localhost:5000/api/articles

# Get article by ID
curl http://localhost:5000/api/articles/<article_id>
```

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/beyondchats-scraper
PORT=5000
NODE_ENV=development
```
