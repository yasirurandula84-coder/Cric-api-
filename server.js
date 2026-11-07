const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// CORS Header Setup (StreamX Website එකට ඩේටා ලබාගැනීම සපයයි)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// 1. Home Route
app.get('/', (req, res) => {
    res.json({
        status: "Online",
        service: "StreamX Unlimited Live Score API",
        endpoint: "/api/live-scores"
    });
});

// 2. Public Direct Live Cricket Score API Route
app.get('/api/live-scores', async (req, res) => {
    try {
        // Direct Unlimited Open Live Score Data Feed
        const response = await axios.get('https://raw.githubusercontent.com/cricapi/cricket-json-data/main/live_matches.json', {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 8000
        });

        res.json({
            success: true,
            type: "Unlimited Live Feed",
            matches: response.data
        });

    } catch (error) {
        // Backup Direct Score Feed 
        try {
            const backupRes = await axios.get('https://api.cricapi.com/v1/cricScore?apikey=demo');
            res.json({
                success: true,
                type: "Backup Live Feed",
                matches: backupRes.data.data || backupRes.data
            });
        } catch (backupErr) {
            res.status(500).json({ 
                success: false, 
                error: "Failed to fetch live scores", 
                details: error.message 
            });
        }
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`StreamX Score API running on port ${PORT}`);
});
