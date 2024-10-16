// Fetch data from the JSON file
fetch('./travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        console.log('Data loaded:', data); // Verify the data
        setupSearch(data); // Set up event listeners
    })
    .catch(error => console.error('Error fetching data:', error));

// Set up search and reset functionality
function setupSearch(data) {
    const searchButton = document.getElementById('btnSearch');
    const resetButton = document.getElementById('btnReset');

    searchButton.addEventListener('click', () => handleSearch(data));
    resetButton.addEventListener('click', resetSearch);
}

// Handle the search operation
function handleSearch(data) {
    const searchTerm = document.getElementById('searchbar').value.toLowerCase();
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = ''; // Clear previous results

    let results = [];

    // Check if the search term matches any specific category
    if (searchTerm.includes('beach') || searchTerm.includes('beaches')) {
        results = data.beaches;
    } else if (searchTerm.includes('temple') || searchTerm.includes('temples')) {
        results = data.temples;
    } else if (searchTerm.includes('country') || searchTerm.includes('countries')) {
        results = data.countries.flatMap(country => country.cities);
    } else {
        // If no category match, search across all descriptions
        results = searchByDescription(data, searchTerm);
    }

    if (results.length === 0) {
        recommendationsContainer.innerHTML = '<p>No results found.</p>';
    } else {
        results.forEach(result => {
            const card = createRecommendationCard(result.name, result.imageUrl, result.description);
            recommendationsContainer.appendChild(card);
        });
    }
}

// Search by description across all categories
function searchByDescription(data, term) {
    let matches = [];

    data.countries.forEach(country => {
        country.cities.forEach(city => {
            if (city.description.toLowerCase().includes(term)) {
                matches.push(city);
            }
        });
    });

    data.temples.forEach(temple => {
        if (temple.description.toLowerCase().includes(term)) {
            matches.push(temple);
        }
    });

    data.beaches.forEach(beach => {
        if (beach.description.toLowerCase().includes(term)) {
            matches.push(beach);
        }
    });

    return matches;
}

// Create a recommendation card
function createRecommendationCard(name, imageUrl, description) {
    const card = document.createElement('div');
    card.classList.add('recommendation-card');
    card.innerHTML = `
        <img src="${imageUrl}" alt="${name}" class="recommendation-image">
        <h3>${name}</h3>
        <p>${description}</p>
        <button class="visit-button">Visit</button>
    `;
    return card;
}

// Reset search
function resetSearch() {
    document.getElementById('searchbar').value = ''; // Clear input
    document.getElementById('recommendations').innerHTML = ''; // Clear results
}
