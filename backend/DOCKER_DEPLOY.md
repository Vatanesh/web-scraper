# Docker Deployment for Render

We are switching to Docker for the backend to ensure Puppeteer runs reliably.

## 1. Create New Web Service
1. Go to Render Dashboard
2. Click **New +** -> **Web Service**
3. Select your repository
4. **Runtime**: Select **Docker** (This is important!)
5. **Root Directory**: `backend`
6. **Environment Variables**:
   - `MONGODB_URI`: (Copy from your previous setup)
   - `GROQ_API_KEY`: (Copy from your previous setup)
   - `PORT`: `5000`

## 2. Why Docker?
Puppeteer needs specific Linux libraries (Chrome dependencies) that aren't available in the standard Node.js environment. The Docker image `ghcr.io/puppeteer/puppeteer` comes with Chrome and all dependencies pre-installed.

## 3. Cleanup
You can delete the old Node.js backend service once the Docker one is running.
