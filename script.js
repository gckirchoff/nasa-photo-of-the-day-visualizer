const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');



// NASA API

const count = 10;
const apiKey = 'JBdw8aVucSO9lWe2MS1VsqJvIdvUOSCBdICsXUiL';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};



// Function to remove the loader and show content
function removeLoaderAndShowContent(page) {
    // Set window to top of page before removing loader
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    // remove loader
    loader.classList.add('hidden');
}



function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Favorites Link
        const faveLink = document.createElement('p');
        faveLink.classList.add('clickable');
        if (page === 'results') {
            faveLink.textContent = 'Add to Favorites';
            faveLink.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            faveLink.textContent = 'Remove Favorite';
            faveLink.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardTitle.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyright = document.createElement('span');
        copyright.textContent = ` ${result.copyright !== undefined ? 'Copyright: ' + result.copyright : ''}`;
        // Putting them all together
        footer.append(date, copyright);
        cardBody.append(cardTitle, faveLink, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.append(card);
    });
}






function updateDom(page) {
    // Get favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    removeLoaderAndShowContent(page);
}







// Get 10 images form NASA API
async function getNasaPictures() {
    // Show loader
    loader.classList.remove('hidden');
    // Get NASA APOD data
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDom('results');
    } catch (error) {
        console.log(error);
    }
}





// Add result to favorites
function saveFavorite(itemUrl) {
    // Loop through results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // Show save confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000);
            // Set favorites in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}



// Remove item from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Update favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDom('favorites');
    }
}





// On load
getNasaPictures();