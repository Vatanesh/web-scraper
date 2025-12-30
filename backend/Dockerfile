FROM ghcr.io/puppeteer/puppeteer:21.5.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Switch to root to fix permissions
USER root

# Change ownership of the working directory
RUN chown -R pptruser:pptruser /usr/src/app

# Switch back to pptruser
USER pptruser

# Copy package files with correct ownership
COPY --chown=pptruser:pptruser package*.json ./

# Install dependencies
RUN npm install

# Copy application files with correct ownership
COPY --chown=pptruser:pptruser . .

# Start the application
CMD [ "npm", "start" ]