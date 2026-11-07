const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 1. Home Route
app.get('/', (req, res) => {
    res.json({
        status: "Online",
        service: "StreamX Unlimited Cricket API",
        endpoint: "/api/live-scores"
    });
});

// 2. Unlimited Live Scores Route
app.get('/api/live-scores', async (req, res) => {
    try {
        // නිදහස් සහ සජීවී ක්‍රිකට් දත්ත ලබා දෙන ප්‍රසිද්ධ සජීවී ෆීඩ් එකක් හරහා දත්ත ලබා ගැනීම
        const response = await axios.get('https://raw.githubusercontent.com/etiennepinchon/cricket-api/master/matches.json', {
            timeout: 5000
        });

        res.json({
            success: true,
            source: "Live Public Feed",
            data: response.data
        });

    } catch (error) {
        // කිසියම් හේතුවකින් එය අසාර්ථක වුවහොත් විකල්ප ක්‍රමයක් මඟින් දත්ත ලබා දීම
        try {
            const altResponse = await axios.get('https://cricket.yahoo.net/siterender/live-score');
            res.json({
                success: true,
                source: "Yahoo Feed",
                data: altResponse.data
            });
        } catch (err) {
            res.status(500).json({ 
                success: false, 
                error: "Could not fetch live scores at the moment", 
                details: error.message 
            });
        }
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`StreamX Live Score API running on port ${PORT}`);
});
