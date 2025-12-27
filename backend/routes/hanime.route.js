// routes/hanime.route.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Proxy for RSS feed
router.get('/rss', async (req, res) => {
    try {
        const response = await axios.get('https://hentaiocean.com/rss.xml', {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        res.set('Content-Type', 'text/xml');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching RSS:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch RSS feed' 
        });
    }
});

// Proxy for metadata API
router.get('/metadata/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const response = await axios.get(
            `https://hentaiocean.com/api?action=hentai&slug=${slug}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching metadata:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch metadata' 
        });
    }
});

export default router;