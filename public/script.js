var searchInput = document.getElementById('search-input');
var loadingIndicator = document.getElementById('loading');
var resultsContainer = document.getElementById('results');

var searchResults = [];

async function searchNoodle() {
    const query = searchInput.value.toLowerCase();
    resultsContainer.innerHTML = '';
    loadingIndicator.style.display = 'flex';

    try {
        const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
        if (!response) {
            throw new Error('Could not fetch data');
        }
        searchResults = await response.json();

        const resultsHTML = searchResults.map(result =>
            `<li>
                <a href="${result.link}">${result.title}</a>
                <p>${result.snippet || "No description available."}</p>
            </li>`
        ).join('');
        resultsContainer.innerHTML = resultsHTML;

    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function formatData(data, format) {
    switch (format) {
        case 'json':
            return JSON.stringify(data, null, 2);
        case 'csv':
            const headers = Object.keys(data[0]).join(",");
            const rows = data.map(row => Object.values(row).join(",")).join("\n");
            return `${headers}\n${rows}`;
        case 'text':
            return data.map(res => `${res.title}\n${res.link}\n${res.snippet}\n`).join('\n');
        default:
            throw new Error('Unsopported format');
    }
}

function downloadFile(data, format, filename) {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event listeners
const searchBtn = document.getElementById('search-btn');
const downloadBtn = document.getElementById('download-btn');

searchBtn.addEventListener('click', () => {
    if (searchInput.value)
        searchNoodle();
    else
        console.log("The search string is empty.");
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value) {
        e.preventDefault();
        searchNoodle();
    }
});

downloadBtn.addEventListener('click', () => {
    var format = document.getElementById('format-select').value;
    if (searchResults && searchResults.length > 0) {
        const formattedData = formatData(searchResults, format);
        const fileName = searchInput.value;
        downloadFile(formattedData, format, fileName);
    } else {
        console.log('No results available');
    }
})


