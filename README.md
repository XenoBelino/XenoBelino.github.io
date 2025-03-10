<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="editor-content">
        <!-- Introduktion till sidan -->
        <div class="intro-section">
            <h1>Välkommen till Video- och Ljudredigeraren!</h1>
            <p>Här kan du ladda upp en video, ändra volyminställningar och justera bakgrunden.</p>
        </div>

        <!-- Video Player Container -->
        <div class="video-container">
            <video id="video-player" controls>
                <source src="assets/videos/sample.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- Filval och info -->
        <button id="browse-btn" class="browse-button">Browse Files</button>
        <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">
        <div id="file-name">No file selected</div>

        <!-- Bakgrunds-mode slider -->
        <div id="background-slider-container" style="display: none;">
            <label for="background-slider">Choose Background Mode:</label>
            <input type="range" id="background-slider" min="0" max="1" value="0" step="1" oninput="changeBackgroundMode()">
            <span id="background-mode">Light Mode</span>
        </div>

        <!-- Knappar för bakgrundsändring och spara inställningar -->
        <button id="change-background-btn" class="button">Change Background</button>
        <button id="save-btn" class="button">Save Changes</button>

        <!-- Volymreglage -->
        <div class="volume-slider-container">
            <div>
                <label for="original-volume">Original Volume:</label>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('original')">
                <span id="original-volume-percent" class="volume-percentage">50%</span>
                <span id="original-volume-icon">🔉</span>
            </div>
            <div>
                <label for="corrupted-volume">Corrupted Volume:</label>
                <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('corrupted')">
                <span id="corrupted-volume-percent" class="volume-percentage">50%</span>
                <span id="corrupted-volume-icon">🔉</span>
            </div>
            <div>
                <label for="music-volume">Music Volume:</label>
                <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('music')">
                <span id="music-volume-percent" class="volume-percentage">50%</span>
                <span id="music-volume-icon">🔉</span>
            </div>
            <div>
                <label for="final-volume">Final Volume:</label>
                <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('final')">
                <span id="final-volume-percent" class="volume-percentage">50%</span>
                <span id="final-volume-icon">🔉</span>
            </div>
        </div>

        <!-- Navigeringsknappar -->
        <button id="back-to-home-btn" class="button back-button">Back to Home Page</button>
    </div>

    <script src="scripts.js" defer></script>
    <script>
        // Uppdatera volymprocenten när användaren justerar reglaget
        function updateVolumePercentage(type) {
            const volumeElement = document.getElementById(`${type}-volume`);
            const volumePercent = document.getElementById(`${type}-volume-percent`);
            volumePercent.textContent = `${volumeElement.value}%`;
        }

        // Hantera filval och visa information om vald fil
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfo = document.getElementById('file-name');
            const videoPlayer = document.getElementById('video-player');
            const videoSource = videoPlayer.querySelector('source');
            if (file) {
                if (file.type === 'video/mp4' || file.type === 'video/webm') {
                    const fileURL = URL.createObjectURL(file);
                    videoSource.src = fileURL;
                    videoPlayer.load();
                    fileInfo.textContent = `Selected file: ${file.name}`;
                    localStorage.setItem('videoFile', fileURL);
                } else {
                    fileInfo.textContent = 'Please select a valid video file (MP4 or WebM).';
                }
            } else {
                fileInfo.textContent = 'No file selected';
            }
        }

        // Visa/Dölj bakgrunds-mode slider
        document.getElementById("change-background-btn").addEventListener("click", function() {
            const sliderContainer = document.getElementById("background-slider-container");
            sliderContainer.style.display = sliderContainer.style.display === "block" ? "none" : "block";
        });

        // Ändra bakgrunds-mode baserat på slider-värde
        function changeBackgroundMode() {
            const sliderValue = document.getElementById("background-slider").value;
            const backgroundModeText = document.getElementById("background-mode");

            if (sliderValue == 0) {
                document.body.style.backgroundColor = "#f4f4f4";
                document.body.style.color = "black";
                backgroundModeText.textContent = "Light Mode";
            } else {
                document.body.style.backgroundColor = "black";
                document.body.style.color = "white";
                backgroundModeText.textContent = "Dark Mode";
            }
        }
    </script>
</body>
</html>
