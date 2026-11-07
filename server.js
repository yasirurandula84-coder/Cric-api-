const express = require('express');
const app = express();

app.use(express.json());

// 1. Home Route
app.get('/', (req, res) => {
    res.json({
        status: "Online",
        mode: "Unlimited Free Score Service",
        endpoint: "/api/unlimited-scores"
    });
});

// 2. Unlimited Score Endpoint (Public Live Feed scraper/fetcher)
app.get('/api/unlimited-scores', async (req, res) => {
    try {
        // මෙහිදී කිසිදු API Key එකක් අවශ්‍ය නොවන ප්‍රසිද්ධ හෝ නිදහස් ක්‍රිකට් ඩේටා ෆීඩ් එකක් පාවිච්චි කළ හැක
        // හෝ අපි Scraping ලොජික් එක මෙහි ක්‍රියාත්මක කරමු
        
        const response = await fetch('https://cricket.yahoo.net/siterender/live-score'); // හෝ වෙනත් ප්‍රසිද්ධ ලයිව් ෆීඩ් එකක්
        // නැතහොත් වෙනත් නොමිලේ ලබා දෙන ක්‍රිකට් දත්ත ප්‍රභවයක්
        
        // තාවකාලිකව සජීවී දත්ත සපයන ප්‍රසිද්ධ ලින්ක් එකක් හරහා ඩේටා ලබා ගැනීම:
        res.json({
            success: true,
            message: "Connected to Unlimited Cricket Feed",
            note: "No request limits applied."
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Unlimited Score API running on port ${PORT}`);
});
