const axios = require('axios');
const cheerio = require('cheerio');

// Search for elements of tandard results (text results, articles, etc.)
function parseStandardResult($e) {
    const link = $e.find('a').attr('href');
    const title = $e.find('h3').text();
    const snippet = $e.find('div.VwiC3b, div.p4wth').text() || "No description available.";

    if (link && link.startsWith('http') && title && snippet)
        return { title, link, snippet };

    return null;
}

// Search for elements of video/youtube results
function parseYoutubeResult($e) {
    const link = $e.find('a.xMqpbd').attr('href');
    const title = $e.find('span.cHaqb').text();
    const snippet = $e.find('span.Sg4azc').text() || "No description available.";

    if (link && link.startsWith('http') && title && snippet)
        return { title, link, snippet };

    return null;
}

async function searchGoogle(query) {
    // create URL link to fetch data from
    // replace the spaces with '+' character
    const formattedQuery = query.replace(/\s+/, '+');
    const url = `https://www.google.com/search?q=${formattedQuery}`;
    const results = [];

    try {
        console.time();
        const { data } = await axios.get(url, {
            headers: {
                // User-Agent simulates a web-browser to bypass certain restrictions 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        $('div.g, div.KYaZsb').each((i, element) => {
            var result;
            const $e = $(element);
            if (($e.hasClass('g')))
                result = parseStandardResult($e);
            else if ($(element).hasClass('KYaZsb'))
                result = parseYoutubeResult($e);

            if (result) results.push(result);
        });
        console.timeEnd();
        return results;

    } catch (error) {
        console.error('Error fetching results: ', error);
        throw new Error('Error fetching results');
    }
}

module.exports = { searchGoogle };