const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use(express.json());

// 1. Home Route
app.get('/', (req, res) => {
    res.json({
        status: "Online",
        service: "StreamX Unlimited Scraping Score API",
        endpoint: "/api/live-scores"
    });
});

// 2. Scraper Route for Unlimited Live Scores
app.get('/api/live-scores', async (req, res) => {
    try {
        // අපි Cricbuzz ලයිව් ස්කෝර් පේජ් එකෙන් ඩේටා ලබා ගැනීමට axios පාවිච්චි කරමු
        const url = 'https://www.cricbuzz.com/cricket-match/live-scores';
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        let matches = [];

        // Cricbuzz සයිට් එකේ ලයිව් මැච් කාඩ්ස් එකතු කරගැනීම
        $('.cb-lv-scrs-well').each((i, element) => {
            const matchTitle = $(element).find('.cb-lv-scrs-hdr').text().trim();
            const matchTeams = $(element).find('.cb-mtch-crd-hdr').text().trim() || $(element).find('a').first().text().trim();
            const matchScore = $(element).find('.cb-scr-txt').text().trim();
            const matchStatus = $(element).find('.cb-text-complete').text().trim() || $(element).find('.cb-text-live').text().trim();

            if (matchTitle || matchScore) {
                matches.push({
                    title: matchTitle || "Live Match",
                    teams: matchTeams || "Teams playing",
                    score: matchScore || "Score updating...",
                    status: matchStatus || "LIVE"
                });
            }
        });

        // මැච් හමු වුණේ නැත්නම් වෙනත් ප්‍රභවයකින් හෝ පණිවිඩයක් දැමීම
        if (matches.length === 0) {
            // වෙනත් විකල්ප සේවා හෝ Fallback ඩේටා
            matches.push({
                title: "Live Cricket Series",
                teams: "Check back shortly",
                score: "Matches are being fetched...",
                status: "LIVE"
            });
        }

        res.json({
            success: true,
            count: matches.length,
            matches: matches
        });

    } catch (error) {
        console.error("Scraping Error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: "Failed to scrape live scores", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Unlimited Scraper API running on port ${PORT}`);
});
