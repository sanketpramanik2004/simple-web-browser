const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const indexFile = path.join(publicDir, 'index.html');

app.use(express.static(publicDir));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

app.get('/', (_req, res) => {
    res.sendFile(indexFile);
});

app.post('/fetch-url', async (req, res) => {
    let { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        let content = response.data;
        
        // Very basic relative URL handling
        const baseUrl = new URL(url).origin;
        const directoryUrl = url.substring(0, url.lastIndexOf('/') + 1);

        // This is a naive replacement to make basic resources load
        content = content.replace(/(href|src)=["'](?!\w+:|\/\/)([^"']+)["']/g, (match, attr, path) => {
            if (path.startsWith('/')) {
                return `${attr}="${baseUrl}${path}"`;
            } else {
                return `${attr}="${directoryUrl}${path}"`;
            }
        });

        res.json({ content });
    } catch (error) {
        console.error('Error fetching URL:', error.message);
        res.status(500).json({ error: 'Failed to fetch the URL. It may be blocking automated requests or the URL is invalid.' });
    }
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
