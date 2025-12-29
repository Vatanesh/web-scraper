# Web Scraper & Content Optimizer

A comprehensive 3-phase full-stack application that scrapes articles, optimizes them using AI, and displays them in a beautiful React UI.

## 🚀 Features

### Phase 1: Backend API
- ✅ Web scraping of BeyondChats blog articles
- ✅ MongoDB database storage
- ✅ Full CRUD REST API
- ✅ Support for both original and optimized articles

### Phase 2: Content Optimizer
- ✅ Google Search automation with Puppeteer
- ✅ Web scraping of top-ranking articles
- ✅ AI-powered content optimization using Google Gemini
- ✅ Automatic citation and reference tracking
- ✅ Smart content analysis and rewriting

### Phase 3: React Frontend
- ✅ Modern, responsive UI with dark mode
- ✅ Article browsing with search and filtering
- ✅ Detailed article view with formatted content
- ✅ Side-by-side comparison of original vs optimized
- ✅ Premium design with glassmorphism and animations

## 📁 Project Structure

```
web-scraper/
├── backend/                 # Phase 1: Express API & MongoDB
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic (scraper)
│   │   └── server.js       # Express server
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── content-optimizer/       # Phase 2: AI Content Optimizer
│   ├── src/
│   │   ├── services/       # Google Search, Scraper, LLM, Publisher
│   │   ├── utils/          # Logger utility
│   │   └── index.js        # Main orchestration script
│   ├── package.json
│   ├── .env
│   └── README.md
│
└── (root)/                  # Phase 3: React Frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API client
    │   ├── styles/         # CSS styling
    │   └── App.js          # Main app with routing
    ├── package.json
    ├── .env
    └── README.md (this file)
```

## 🛠️ Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local or Atlas)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

## 📦 Installation

### 1. Install Backend (Phase 1)

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env and set your MONGODB_URI
```

### 2. Install Content Optimizer (Phase 2)

```bash
cd content-optimizer
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Install Frontend (Phase 3)

```bash
cd ..  # Back to root
npm install
```

## 🚀 Usage

### Step 1: Start MongoDB

```bash
# If using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB instance
```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

Server will start on `http://localhost:5000`

### Step 3: Scrape Initial Articles

```bash
# In a new terminal, make a POST request to scrape articles:
curl -X POST http://localhost:5000/api/articles/scrape

# Or use a REST client like Postman
```

This will scrape 5 articles from BeyondChats blog and store them in MongoDB.

### Step 4: Run Content Optimizer (Optional)

```bash
cd content-optimizer
npm start
```

This will:
1. Fetch original articles from the API
2. Search Google for each article title
3. Scrape top 2 ranking articles
4. Use Gemini AI to optimize the content
5. Publish optimized versions with citations

### Step 5: Start React Frontend

```bash
cd ..  # Back to root
npm start
```

Frontend will start on `http://localhost:3000`

## 🎨 Features Demo

### Article List
- Search articles by title
- Filter by Original/Optimized
- Premium card-based grid layout
- Responsive design for all devices

### Article Detail
- Full formatted article content
- Author and metadata display
- References section for optimized articles
- Link back to original version

### Content Optimization
- AI analyzes top-ranking Google results
- Rewrites content with improved structure
- Maintains factual accuracy
- Adds proper citations

## 🔧 API Endpoints

### Backend API (Port 5000)

- `POST /api/articles/scrape` - Scrape BeyondChats articles
- `GET /api/articles` - Get all articles (supports filtering)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Query Parameters:
- `isOptimized=true|false` - Filter by optimization status
- `page=1` - Page number for pagination
- `limit=10` - Items per page

## 🎯 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/beyondchats-scraper
PORT=5000
NODE_ENV=development
```

### Content Optimizer (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
BACKEND_API_URL=http://localhost:5000/api
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Test Backend API
```bash
# Get all articles
curl http://localhost:5000/api/articles

# Get only optimized articles
curl "http://localhost:5000/api/articles?isOptimized=true"

# Get article by ID
curl http://localhost:5000/api/articles/<article_id>
```

### Test Frontend
1. Open `http://localhost:3000`
2. Verify articles display in grid
3. Test search and filtering
4. Click an article to view details
5. Check responsive design (DevTools)

## 📝 Notes

- The scraper targets 5 specific BeyondChats articles
- Content optimizer processes one article at a time by default
- Puppeteer uses stealth mode to avoid Google detection
- Premium UI design with dark mode and glassmorphism effects
- Fully responsive for mobile, tablet, and desktop

## 🐛 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env

**Content Optimizer fails:**
- Verify GEMINI_API_KEY is valid
- Check backend API is running
- Google may block automated searches (use VPN or delays)

**Frontend shows no articles:**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL is correct
- Make sure articles were scraped first

## 📄 License

MIT

## 👨‍💻 Author

Built as a demonstration of modern full-stack development with AI integration.

---

**Stack:**
- Backend: Node.js, Express, MongoDB, Mongoose
- Scraping: Axios, Cheerio, Puppeteer
- AI: Google Gemini API
- Frontend: React, React Router
- Styling: Custom CSS with modern design patterns
