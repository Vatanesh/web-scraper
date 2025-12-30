# Render Deployment Configuration

## Build Command

In Render dashboard, set:
- **Build Command**: `npm install && npm run install:browsers`
- **Start Command**: `npm start`

## Environment Variables for Render

Add these in your Render dashboard → Environment:

```
MONGODB_URI=<your-mongodb-atlas-connection-string>
GROQ_API_KEY=<your-groq-api-key>
PORT=5000
NODE_ENV=production
```

## Alternative: Using Aptfile

If the above doesn't work, create an `Aptfile` in the backend directory with:

```
chromium
chromium-driver
```

Render will automatically install these packages during deployment.
