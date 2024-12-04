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
            justify-content: flex-start; /* Gör så att innehållet börjar från vänster */
            align-items: flex-start; /* Justera till vänster */
            height: 100vh;
            background-image: url('path/to/your/image.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            overflow-y: auto;
            padding-left: 10px; /* Justerat för att ge mer utrymme från vänsterkanten */
        }

        .editor-content {
            text-align: left; /* Säkerställ att texten är vänsterjusterad */
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
            width: 90%; /* Justera för att passa bättre på sidan */
        }

        .section {
            display: flex;
            flex-direction: row;
            justify-content: flex-start; /* Se till att innehållet är vänsterjusterat */
            align-items: center;
            width: 100%;
        }

        .section-text {
            color: #6a0dad;
            font-size: 18px;
            flex: 1;
            margin-left: 10px;
        }

        .volume-slider-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
            margin-left: 0; /* Fjärrar alla extra mellanrum */
        }

        .volume-icon {
            font-size: 30px;
            cursor: pointer;
            margin-left: 0; /* Fjärrar extra mellanrum till vänster om ikonen */
        }

        .volume-slider {
            width: 200px; /* Justera bredden för bättre visning */
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
    </style>
</head>
<body>

    <div class="editor-content">
        <h1>Edit Your Files</h1>
        
        <div class="section-container">
            <!-- Your original file section -->
            <div class="section">
                <div class="section-text">Your original File</div>
            </div>
            <div class="volume-slider-container">
                <span id="original-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="original-volume-percent">50%</div>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('original')">
            </div>

            <!-- Overwriting audio section -->
            <div class="section">
                <div class="section-text">Overwriting audio</div>
            </div>
            <div class="volume-slider-container">
                <span id="corrupted-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="corrupted-volume-percent">30%</div>
                <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('corrupted')">
            </div>

            <!-- Music from file section -->
            <div class="section">
                <div class="section-text">The Music from your file</div>
            </div>
            <div class="volume-slider-container">
                <span id="music-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="music-volume-percent">30%</div>
                <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('music')">
            </div>

            <!-- Final Result section -->
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

    <script>
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
    </script>
</body>
</html>
