const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const fs = require('fs');

const log = (message) => {
    console.log(message);
    fs.appendFileSync('test-results.txt', message + '\n');
};

const runTest = async () => {
    fs.writeFileSync('test-results.txt', ''); // Clear file

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        log('❌ GEMINI_API_KEY is missing in .env');
        return;
    }
    log(`API Key loaded: ${apiKey.substring(0, 5)}...`);

    try {
        log('Listing available models...');

        // Direct REST call to list models
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            log(`Found ${data.models.length} models:`);
            data.models.forEach(m => log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            log('No models found or error: ' + JSON.stringify(data));
        }

    } catch (error) {
        log(`❌ Error listing models: ${error.message}`);
    }
};

runTest();
