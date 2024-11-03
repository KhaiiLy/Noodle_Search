const express = require('express');
const { searchGoogle } = require('../controllers/searchController');
const router = express.Router();


router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query)
        return res.status(400).json({ error: 'Query parameter is required' });
    try {
        const results = await searchGoogle(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
