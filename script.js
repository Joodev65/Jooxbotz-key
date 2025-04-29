// Replace with your RapidAPI key
const apiKey = "972f5c568dmsh552ff4877326665p1b6e67jsn290d2652a173";

async function fetchMovies() {
    const apiUrl = "https://porn-xnxx-api.p.rapidapi.com/download";
    const videoLink = "https://xnxx.com/video-wugb904/fucking_his_step_sister_lexxi_steele_in_high_definition"; // Replace with your own video links

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'porn-xnxx-api.p.rapidapi.com',
            'x-rapidapi-key': apiKey
        },
        body: JSON.stringify({ "video_link": videoLink })
    });

    const data = await response.json();

    if (data && data.url) {
        const videoUrl = data.url;  // Get the download URL from the API
        createMovieCard(videoUrl);
    } else {
        console.error("No video URL found.");
    }
}

function createMovieCard(videoUrl) {
    const movieContainer = document.getElementById('movie-container');

    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const moviePoster = document.createElement('img');
    moviePoster.src = "https://via.placeholder.com/200x300/000000/FFFFFF?text=Movie+Poster"; // Replace with actual poster URL
    moviePoster.alt = "Movie Poster";

    const movieTitle = document.createElement('h3');
    movieTitle.innerText = "Movie Title";  // Replace with actual movie title

    movieCard.appendChild(moviePoster);
    movieCard.appendChild(movieTitle);

    movieCard.addEventListener('click', () => {
        window.open(videoUrl, "_blank");
    });

    movieContainer.appendChild(movieCard);
}

// Call fetchMovies to load a movie initially
fetchMovies();
