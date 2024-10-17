// Global variable to store the data from the JSON
let recommendationData = {};

// Load the data on page load
window.onload = async () => {
    console.log('Page loaded'); // Confirm page load

    try {
        const response = await fetch('travel_recommendation_api.json');
        recommendationData = await response.json();
        console.log('Data loaded:', recommendationData); // Confirm data load
    } catch (error) {
        console.error('Error loading JSON:', error);
    }

    const searchButton = document.getElementById('btnSearch');
    const resetButton = document.getElementById('btnReset');

    searchButton.addEventListener('click', handleSearch);
    resetButton.addEventListener('click', resetSearch);
};

// Handle the search operation based on the main categories
// Handle the search operation based on the main categories
function handleSearch() {
    const searchTerm = document.getElementById('searchbar').value.toLowerCase().trim();
    console.log('Search term:', searchTerm);

    if (!searchTerm) return; // Avoid empty search

    let filteredResults = [];

    // Search logic based on the provided keyword category
    if (searchTerm.includes('beach')) {
        console.log('Searching in beaches...');
        filteredResults = recommendationData.beaches;
    } else if (searchTerm.includes('temple')) {
        console.log('Searching in temples...');
        filteredResults = recommendationData.temples;
    } else if (searchTerm.includes('country') || searchTerm.includes('countries')) {
        console.log('Searching in countries...');
        recommendationData.countries.forEach(country => {
            filteredResults.push(...country.cities);
        });
    } else {
        console.log('Searching for specific countries or cities...');
        // Search for matches within countries or their cities
        recommendationData.countries.forEach(country => {
            if (country.name.toLowerCase().includes(searchTerm)) {
                console.log(`Country match found: ${country.name}`);
                filteredResults.push(...country.cities);
            }
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(searchTerm)) {
                    console.log(`City match found: ${city.name}`);
                    filteredResults.push(city);
                }
            });
        });
    }

    console.log('Displaying results:', filteredResults); // Log results
    displaySearchResults(filteredResults);
}


// Function to display the search results
function displaySearchResults(results) {
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        recommendationsContainer.innerHTML = '<p class="no-results">No results found.</p>';
    } else {
        results.forEach(result => {
            console.log('Rendering:', result);

            const recommendation = document.createElement('div');
            recommendation.classList.add('recommendation-card');
            recommendation.innerHTML = `
                <img src="${result.imageUrl}" alt="${result.name}" class="recommendation-image">
                <h3>${result.name}</h3>
                <p>${result.description}</p>
                <button class="visit-btn">Visit</button>
            `;
            recommendationsContainer.appendChild(recommendation);
        });
    }
}

// Reset the search field and recommendations
function resetSearch() {
    document.getElementById('searchbar').value = ''; // Clear input
    document.getElementById('recommendations').innerHTML = ''; // Clear displayed recommendations
    console.log('Search reset');
}
