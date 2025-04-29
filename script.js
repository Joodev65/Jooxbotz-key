// Function to fetch video data
function fetchVideoData(videoLink) {
  const url = 'https://porn-xnxx-api.p.rapidapi.com/download';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': '972f5c568dmsh552ff4877326665p1b6e67jsn290d2652a173',
      'x-rapidapi-host': 'porn-xnxx-api.p.rapidapi.com'
    },
    body: JSON.stringify({
      video_link: videoLink
    })
  };

  // Perform the fetch request
  fetch(url, options)
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
      // Handle the response data (e.g., display the video or link)
      console.log(data);  // You can access video download link in `data`
      const videoDownloadLink = data.download_link; // Assuming the API returns a 'download_link' key
      if (videoDownloadLink) {
        // You can now display the video download link or embed it in your webpage
        document.getElementById("video-link").innerHTML = `Klik di sini untuk menonton video: <a href="${videoDownloadLink}" target="_blank">${videoDownloadLink}</a>`;
        document.getElementById("download-link").style.display = 'inline'; // Show download link
        document.getElementById("download-link").href = videoDownloadLink;
      } else {
        document.getElementById("video-link").innerHTML = "Video tidak ditemukan.";
      }
    })
    .catch(error => console.error('Error:', error));  // Handle errors
}

// Example usage
fetchVideoData("https://xnxx.com/video-wugb904/fucking_his_step_sister_lexxi_steele_in_high_definition");