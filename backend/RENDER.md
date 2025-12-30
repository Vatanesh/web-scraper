# Render Deployment Configuration

## Environment Variables for Render

Add these in your Render dashboard → Environment:

```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
MONGODB_URI=<your-mongodb-atlas-connection-string>
GROQ_API_KEY=<your-groq-api-key>
PORT=5000
NODE_ENV=production
```

## Build Command

In Render dashboard, set:
- **Build Command**: `npm install && npm run puppeteer:install`
- **Start Command**: `npm start`

## Alternative: Using Aptfile

If the above doesn't work, create an `Aptfile` in the backend directory with:

```
chromium
chromium-driver
```

Render will automatically install these packages during deployment.
