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
            align-items: center;
            height: 100vh;
            background-image: linear-gradient(to right, #4F4A85, #ffffff, #4F4A85);
            background-size: cover;
            overflow-y: auto;
        }

        .editor-content {
            text-align: left;
            padding: 20px;
            max-width: 100%;
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 20px;
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

        .volume-slider-container {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .volume-icon {
            margin-right: 10px;
            font-size: 24px;
            cursor: pointer;
        }

        .volume-slider {
            width: 100px;
            margin-bottom: 5px;
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
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
        <div class="section">
            <div class="section-text">Your original file</div>
            <div class="volume-slider-container">
                <span id="original-volume-icon" class="volume-icon" onclick="toggleMute('original')">🔊</span> 
                <div class="volume-percentage" id="original-volume-percent">50%</div>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('original')">
            </div>
        </div>
        <!-- Repeat for other sliders -->
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
