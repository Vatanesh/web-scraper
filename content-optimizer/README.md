# Content Optimizer

Node.js script that optimizes articles using Google Search analysis and LLM (Gemini AI).

## Features

- ✅ Fetches articles from backend API
- ✅ Searches Google for top-ranking content
- ✅ Scrapes reference articles
- ✅ Uses Gemini AI to optimize content
- ✅ Publishes optimized articles with citations

## Prerequisites

- Node.js (v14+)
- Backend API running (Phase 1)
- Google Gemini API key

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env and add your Gemini API key
```

## Configuration

Update `.env` file:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
BACKEND_API_URL=http://localhost:5000/api
```

### Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

## Usage

```bash
# Run the optimizer
npm start

# Or
node src/index.js
```

## How It Works

1. **Fetch Articles**: Retrieves original articles from backend API
2. **Google Search**: Searches article title on Google
3. **Scrape References**: Extracts content from top 2 results
4. **LLM Optimization**: Uses Gemini AI to rewrite article with improved structure
5. **Publish**: Posts optimized article back to API with citations

## Output

The script creates optimized versions with:
- Improved formatting and structure
- Better SEO optimization
- Citations to reference articles
- Link back to original article

## Notes

- Processes one article at a time by default (change in src/index.js)
- Uses Puppeteer with stealth mode for Google searches
- Includes delays between requests to be respectful to servers
- Automatically adds reference citations at the end

## Troubleshooting

**Google search blocks/CAPTCHAs:**
- The script uses Puppeteer with stealth plugin
- Add longer delays if needed
- Consider using SerpAPI as alternative

**Gemini API errors:**
- Check your API key is valid
- Ensure you have API quota available
- Check network connectivity

**Reference article scraping fails:**
- The fallback URLs (Forbes, IBM) should be accessible
- Check your network connection
- Try running again (temporary network issues)

## CAPTCHA Solving (Optional)

To bypass Google's automation detection, you can integrate 2Captcha:

1. Sign up at [2Captcha.com](https://2captcha.com)
2. Add API key to `.env`: `TWOCAPTCHA_API_KEY=your_key`
3. See [CAPTCHA_GUIDE.md](./CAPTCHA_GUIDE.md) for details

**Note**: CAPTCHA solving is optional. The script uses working fallback reference URLs by default.
