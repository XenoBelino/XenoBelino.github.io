<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">

    <!-- Wavesurfer.js -->
    <script src="https://unpkg.com/wavesurfer.js"></script>

    <style>
        body {
            font-family: 'Lato', sans-serif;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            height: 100vh;
            background-image: url('path/to/your/image.jpg'); /* Ändra till korrekt bildväg */
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            overflow-y: auto;
            padding-left: 10px;
        }

        .editor-content {
            text-align: left;
            padding: 20px;
            width: 100%;
            flex: 1;
            background-color: transparent;
            border-radius: 10px;
        }

        .section-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 30px;
            width: 90%;
            padding-left: 0;
        }

        .section {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
        }

        .section-text {
            color: #6a0dad;
            font-size: 18px;
            flex: 1;
            margin-left: 0;
        }

        .volume-slider-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
            margin-left: 0;
            width: 100%; /* Gör så att sliden fyller hela raderna */
        }

        .volume-icon {
            font-size: 30px;
            cursor: pointer;
            margin-left: 0;
        }

        .volume-slider {
            width: 100%; /* Slidern ska vara lika lång som texten */
            max-width: 500px; /* Maxlängd på slider */
            margin-bottom: 5px;
            cursor: pointer;
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
        }

        /* Wavesurfer container för ljudgrafen */
        .wavesurfer-container {
            width: 100%;
            height: 100px; /* Höjd på ljudgrafen */
            margin-bottom: 20px;
        }

        /* Knappar längst ner till höger */
        .buttons-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
        }

        .button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            background-color: #6a0dad;
            color: white;
            transition: background-color 0.3s;
        }

        .button:hover {
            background-color: #5c0b8a;
        }

    </style>
</head>
<body>

    <div class="editor-content">
        
        <!-- Videospelaren -->
        <div class="video-container">
            <video controls>
                <source src="path/to/your/video.mp4" type="video/mp4"> <!-- Uppdatera till korrekt videoväg -->
                Din webbläsare stödjer inte videospelaren.
            </video>
        </div>

        <div class="section-container">
            <!-- Originalfilens text och volymkontroll -->
            <div class="section">
                <div class="section-text">Your original File</div>
            </div>
            <div class="volume-slider-container">
                <span id="original-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="original-volume-percent">40%</div>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="40" oninput="updateVolumePercentage('original')">
            </div>
            <div class="wavesurfer-container" id="wavesurfer-original"></div>

            <!-- Överskrivning ljud text och volymkontroll -->
            <div class="section">
                <div class="section-text">Overwriting audio</div>
            </div>
            <div class="volume-slider-container">
                <span id="corrupted-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="corrupted-volume-percent">30%</div>
                <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('corrupted')">
            </div>
            <div class="wavesurfer-container" id="wavesurfer-corrupted"></div>

            <!-- Musik från din fil text och volymkontroll -->
            <div class="section">
                <div class="section-text">The Music from your file</div>
            </div>
            <div class="volume-slider-container">
                <span id="music-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="music-volume-percent">30%</div>
                <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('music')">
            </div>
            <div class="wavesurfer-container" id="wavesurfer-music"></div>

            <!-- Slutresultat text och volymkontroll -->
            <div class="section">
                <div class="section-text">The Final Result</div>
            </div>
            <div class="volume-slider-container">
                <span id="final-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="final-volume-percent">70%</div>
                <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="70" oninput="updateVolumePercentage('final')">
            </div>
            <div class="wavesurfer-container" id="wavesurfer-final"></div>
        </div>
    </div>

    <!-- Knappar längst ner till höger -->
    <div class="buttons-container">
        <button class="button" id="save-btn">Save</button>
        <button class="button" id="browse-btn">Browse my files</button>
    </div>

    <script>
        // Funktion för att uppdatera volymprocenten och ikonen vid sliderförändring
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

        // Skapa ljudgraf med Wavesurfer.js
        function createWaveform(id, audioUrl) {
            var wavesurfer = WaveSurfer.create({
                container: `#${id}`,
                waveColor
