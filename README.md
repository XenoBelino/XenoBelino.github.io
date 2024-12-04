<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/wavesurfer.js"></script>

    <style>
        body {
            font-family: 'Lato', sans-serif;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start; /* Justera till vänster */
            height: 100vh;
            background-image: linear-gradient(to right, #4F4A85, #ffffff, #4F4A85);
            background-size: cover;
            overflow-y: auto;
            padding-left: 20px; /* Lägg till vänstermarginal */
        }

        .editor-content {
            text-align: left; /* Justera till vänster */
            padding: 20px;
            width: 100%;
            flex: 1;
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
        }

        video {
            margin-top: 20px;
            width: 70%;
            height: auto;
            border-radius: 8px;
            display: block;
            background-color: #000;
        }

        .section-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 30px;
            width: 80%;
        }

        .section {
            display: flex;
            flex-direction: row;
            justify-content: flex-start; /* Justera till vänster */
            align-items: center;
            width: 100%;
        }

        .section-text {
            color: #4F4A85;
            font-size: 18px;
            flex: 1;
            margin-left: 10px;
        }

        .volume-slider-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* Justera till vänster */
            gap: 10px;
            margin-left: 20px; /* Lägg till vänstermarginal för att skapa avstånd */
        }

        .volume-icon {
            font-size: 30px;
            cursor: pointer;
        }

        .volume-slider {
            width: 100px;
            margin-bottom: 5px;
            cursor: pointer;
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
        }

        /* För animationen när volymen ändras */
        .volume-slider-container:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <video id="video-player" controls>
            <source id="video-source" type="video/mp4">
            Your browser does not support the video tag.
        </video>

        <div id="file-info"></div>
    </div>

    <div class="section-container">
        <!-- Your original file section -->
        <div class="section">
            <div class="section-text">Your original File</div>
        </div>
        <div class="volume-slider-container">
            <span id="original-volume-icon" class="volume-icon" onclick="toggleMute('original')">🔊</span> 
            <div class="volume-percentage" id="original-volume-percent">50%</div>
            <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('original')">
        </div>

        <!-- Overwriting audio/corrupted audio section -->
        <div class="section">
            <div class="section-text" style="color: #4F4A85;">Overwriting audio / corrupted audio</div>
        </div>
        <div class="volume-slider-container">
            <span id="corrupted-volume-icon" class="volume-icon" onclick="toggleMute('corrupted')">🔊</span> 
            <div class="volume-percentage" id="corrupted-volume-percent">30%</div>
            <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('corrupted')">
        </div>

        <!-- The Music from your file section -->
        <div class="section">
            <div class="section-text">The Music from your file</div>
        </div>
        <div class="volume-slider-container">
            <span id="music-volume-icon" class="volume-icon" onclick="toggleMute('music')">🔊</span> 
            <div class="volume-percentage" id="music-volume-percent">30%</div>
            <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('music')">
        </div>

        <!-- The Final Result section -->
        <div class="section">
            <div class="section-text">The Final Result</div>
        </div>
        <div class="volume-slider-container">
            <span id="final-volume-icon" class="volume-icon" onclick="toggleMute('final')">🔊</span> 
            <div class="volume-percentage" id="final-volume-percent">70%</div>
            <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="70" oninput="updateVolumePercentage('final')">
        </div>
    </div>

    <script>
        // Uppdatera volymprocenten och ändra ljudikonen baserat på volymnivån
        function updateVolumePercentage(type) {
            const volumeSlider = document.getElementById(`${type}-volume`);
            const volume = volumeSlider.value;
            const volumePercentage = document.getElementById(`${type}-volume-percent`);
            const volumeIcon = document.getElementById(`${type}-volume-icon`);

            volumePercentage.textContent = volume + "%";

            if (volume == 0) {
                volumeIcon.textContent = "🔇"; // Muted
            } else if (volume > 0 && volume <= 33) {
                volumeIcon.textContent = "🔊"; // Låg volym
            } else if (volume > 33 && volume <= 66) {
                volumeIcon.textContent = "🔉"; // Medium volym
            } else {
                volumeIcon.textContent = "🔊"; // Hög volym
            }
        }

        // Hantera muting av ljudet
        function toggleMute(type) {
            const volumeSlider = document.getElementById(`${type}-volume`);
            const volumeIcon = document.getElementById(`${type}-volume-icon`);

            if (volumeSlider.value > 0) {
                volumeSlider.value = 0;
                volumeIcon.textContent = "🔇"; // Mutad ikon
            } else {
                volumeSlider.value = 50; // Återställ volymen
                volumeIcon.textContent = "🔊"; // Återställ till normal ikon
            }

            updateVolumePercentage(type);
        }
    </script>
</body>
</html>
