<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
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
            align-items: flex-start;
            height: 100vh;
            background-image: url('image.jpg'); /* Ändra till rätt bildfil */
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
            width: fit-content;
            transition: transform 0.2s;
        }

        .volume-icon {
            font-size: 30px;
            cursor: pointer;
            margin-left: 0;
        }

        .volume-slider {
            width: 200px;
            margin-bottom: 5px;
            cursor: pointer;
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
        }

        .volume-slider-container:hover {
            transform: scale(1.05);
        }

        .video-container {
            width: 100%;
            height: 500px;
            margin-bottom: 20px;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
    </style>
</head>
<body>

    <div class="editor-content">
        
        <!-- Videospelaren -->
        <div class="video-container">
            <video controls>
                <source src="video.mp4" type="video/mp4"> <!-- Uppdatera med rätt filväg -->
                Din webbläsare stödjer inte videospelaren.
            </video>
        </div>

        <div class="section-container">
            <!-- Your original file text and volume control -->
            <div class="section">
                <div class="section-text">Your original File</div>
            </div>
            <div class="volume-slider-container">
                <span id="original-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="original-volume-percent">40%</div>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="40" oninput="updateVolumePercentage('original')">
            </div>

            <!-- Overwriting audio text and volume control -->
            <div class="section">
                <div class="section-text">Overwriting audio</div>
            </div>
            <div class="volume-slider-container">
                <span id="corrupted-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="corrupted-volume-percent">30%</div>
                <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('corrupted')">
            </div>

            <!-- Music from your file text and volume control -->
            <div class="section">
                <div class="section-text">The Music from your file</div>
            </div>
            <div class="volume-slider-container">
                <span id="music-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="music-volume-percent">30%</div>
                <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('music')">
            </div>

            <!-- Final result text and volume control -->
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
            const volumeIcon = document.getElement
