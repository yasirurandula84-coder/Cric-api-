const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// CORS Header Setup
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

// 2. Live Cricket Scores Route
app.get('/api/live-scores', async (req, res) => {
    try {
        // ක්‍රිකට් ලයිව් ඩේටා ලබා ගැනීමට නිල සහ ස්ථාවර Open API එකක් භාවිතා කිරීම
        const response = await axios.get('https://api.cricapi.com/v1/currentMatches?apikey=c764e525-2b78-4df7-8051-248100523f68&offset=0', {
            timeout: 8000
        });

        res.json({
            success: true,
            source: "Public Live Feed",
            data: response.data.data || response.data
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch live scores", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`StreamX Score API running on port ${PORT}`);
});
