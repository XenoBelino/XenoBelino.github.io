<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Lato', sans-serif;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            height: 100vh;
            background-image: url('images/image.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            overflow-y: auto;
        }

        .editor-content {
            text-align: left;
            padding: 20px;
            width: 100%;
            flex: 1;
            background-color: transparent;
            border-radius: 10px;
        }

        .video-container {
            width: 80%;
            margin: 40px auto;
            border-radius: 10px; /* Rundade kanter för videospelaren */
            overflow: hidden;
        }

        video {
            width: 100%;
            height: 100%;
            border-radius: 10px; /* Rundade kanter */
        }

        .section-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 30px;
            width: 100%;
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
        }

        .volume-slider-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
        }

        .volume-slider {
            width: 200px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .volume-slider:hover {
            transform: scale(1.05);
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
        }

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

        .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            background-color: #6a0dad;
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .back-button:hover {
            background-color: #5c0b8a;
        }

        .file-info {
            color: #fff;
            font-size: 16px;
            margin-top: 20px;
        }

        /* Gör input[type="file"] osynlig men fortfarande interaktiv */
        #file-input {
            display: none;
            position: absolute;
            z-index: 1000;
        }
    </style>
</head>
<body>

    <button class="back-button" onclick="window.location.href = 'index.html'">Back to Homepage</button>

    <div class="editor-content">
        <!-- Video Player -->
        <div class="video-container">
            <video controls id="video-player">
                <source id="video-source" src="videos/video.mp4" type="video/mp4">
                Din webbläsare stödjer inte videospelaren.
            </video>
        </div>

        <div class="file-info" id="file-info">No file selected</div>

        <!-- Volume Sliders -->
        <div class="section-container">
            <div class="section">
                <div class="section-text">Your original File</div>
            </div>
            <div class="volume-slider-container">
                <span id="original-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="original-volume-percent">40%</div>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="40" oninput="updateVolumePercentage('original')">
            </div>

            <div class="section">
                <div class="section-text">Overwriting audio</div>
            </div>
            <div class="volume-slider-container">
                <span id="corrupted-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="corrupted-volume-percent">30%</div>
                <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('corrupted')">
            </div>

            <div class="section">
                <div class="section-text">The Music from your file</div>
            </div>
            <div class="volume-slider-container">
                <span id="music-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="music-volume-percent">30%</div>
                <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('music')">
            </div>

            <div class="section">
                <div class="section-text">The Final Result</div>
            </div>
            <div class="volume-slider-container">
                <span id="final-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="final-volume-percent">70%</div>
                <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="70" oninput="updateVolumePercentage('final')">
            </div>
        </div>
    </div>

    <!-- Buttons -->
    <div class="buttons-container">
        <button class="button" id="save-btn">Save</button>
        <button class="button" id="browse-btn">Browse my files</button>
    </div>

    <!-- File input (hidden but functional) -->
    <input type="file" id="file-input" accept="video/*,audio/*" onchange="handleFileSelect(event)" />

    <script>
        // Uppdatera volymprocenten och ikoner vid sliderförändring
        function updateVolumePercentage(type) {
            const volumeSlider = document.getElementById(`${type}-volume`);
            const volume = volumeSlider.value;
            const volumePercentage = document.getElementById(`${type}-volume-percent`);
            const volumeIcon = document.getElementById(`${type}-volume-icon`);
            
            volumePercentage.textContent = `${volume}%`;

            // Uppdatera ikon baserat på volym
            if (volume == 0) {
                volumeIcon.textContent = '🔇';
            } else if (volume <= 30) {
                volumeIcon.textContent = '🔈';
            } else if (volume <= 70) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }

        // Funktion för att hantera filval
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfo = document.getElementById('file-info');
            const videoPlayer = document.getElementById('video-player');
            const videoSource = document.getElementById('video-source');

            if (file) {
                const fileURL = URL.createObjectURL(file);
                videoSource.src = fileURL;
                videoPlayer.load();
                fileInfo.textContent = `Selected file: ${file.name}`;
            }
        }

        // Trigger för att öppna filväljaren
        document.getElementById('browse-btn').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });
    </script>
</body>
</html>
