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
            background-image: url('image.jpg'); /* Ändra denna till en korrekt bildfil */
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
            width: fit-content; /* Begränsar bredden till innehållet */
            transition: transform 0.2s; /* För smidig övergång på hover */
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
            transform: scale(1.05); /* Förstora vid hover */
        }

        /* Videospelaren */
        .video-container {
            width: 100%;
            height: 500px; /* Gör videospelaren stor */
            margin-bottom: 20px;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
                <source src="video.mp4" type="video/mp4"> <!-- Uppdatera denna med en korrekt sökväg -->
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

        // Hantera Save-knappen
        document.getElementById("save-btn").addEventListener("click", function() {
            alert("Save functionality is triggered!");
            // Här kan du lägga till den logik som sparar filen
        });

        // Hantera Browse my files-knappen
        document.getElementById("browse-btn").addEventListener("click", function() {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.style.display = "none";
            fileInput.accept = ".
