<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <link rel="stylesheet" href="styles.css"> <!-- Kontrollera att denna fil finns -->
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
                <source src="assets/videos/sample.mp4" type="video/mp4"> <!-- Kontrollera att filen finns -->
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- Filval och info -->
        <button id="browse-btn" class="browse-button">Browse Files</button>
        <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">
        <div id="file-name">No file selected</div>

        <!-- Knappar för bakgrundsändring och spara inställningar -->
        <button id="change-background-btn" class="button">Change Background</button> <!-- Knappen -->
        <button id="save-btn" class="button">Save Changes</button>

        <!-- Volymreglage -->
        <div class="volume-slider-container">
            <div>
                <label for="original-volume">Original Volume:</label>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('original')">
                <span id="original-volume-percent" class="volume-percentage">50%</span>
                <span id="original-volume-icon">🔉</span>
            </div>
            <div>
                <label for="corrupted-volume">Corrupted Volume:</label>
                <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('corrupted')">
                <span id="corrupted-volume-percent" class="volume-percentage">50%</span>
                <span id="corrupted-volume-icon">🔉</span>
            </div>
            <div>
                <label for="music-volume">Music Volume:</label>
                <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('music')">
                <span id="music-volume-percent" class="volume-percentage">50%</span>
                <span id="music-volume-icon">🔉</span>
            </div>
            <div>
                <label for="final-volume">Final Volume:</label>
                <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('final')">
                <span id="final-volume-percent" class="volume-percentage">50%</span>
                <span id="final-volume-icon">🔉</span>
            </div>
        </div>

        <!-- Navigeringsknappar -->
        <button id="back-to-home-btn" class="button back-button">Back to Home Page</button>
    </div>

    <script src="scripts.js" defer></script> <!-- Kontrollera att denna fil finns -->

    <script>
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
                } else {
                    fileInfo.textContent = 'Please select a valid video file (MP4 or WebM).';
                }
            } else {
                fileInfo.textContent = 'No file selected';
            }
        }

        // Triggera filinputen när knappen klickas
        document.getElementById('browse-btn').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });

        // Eventlistener för "Change Background"-knappen
        document.getElementById("change-background-btn").addEventListener("click", function() {
            const mode = confirm("Choose background mode:\n\nClick 'OK' for Dark Mode\nClick 'Cancel' for Light Mode");

            if (mode) {
                // Dark Mode
                document.body.style.backgroundColor = "black";
                document.body.style.color = "white";
            } else {
                // Light Mode (standard)
                document.body.style.backgroundColor = "#f4f4f4";
                document.body.style.color = "black";
            }
        });

        // Volymuppdatering
        function updateVolumePercentage(type) {
            const volumeElement = document.getElementById(`${type}-volume`);
            const volumePercent = document.getElementById(`${type}-volume-percent`);
            volumePercent.textContent = `${volumeElement.value}%`;
        }
    </script>

    <style>
        /* Grundläggande stil för hela sidan */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4; /* Standard Light Mode bakgrundsfärg */
            margin: 0;
            padding: 0;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            max-width: 900px;
            margin: auto;
        }

        /* Stil för knappar */
        .button, .browse-button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            background-color: #6a0dad;
            color: white;
            transition: background-color 0.3s;
        }

        .button:hover, .browse-button:hover {
            background-color: #5c0b8a;
        }

        /* Volymreglage */
        .volume-slider-container {
            margin-top: 20px;
        }

        /* Stil för texten "No file selected" */
        #file-name {
            color: black;
            font-size: 18px;
        }

        /* Stil för bakgrunds- och navigeringsknappar */
        .back-button {
            position: fixed;
            top: 10px;
            left: 20px;
            padding: 10px 20px;
            background-color: #6a0dad;
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }

        .back-button:hover {
            background-color: #5c0b8a;
        }

        /* Stil för videospelaren */
        .video-container {
            width: 60%; /* Justera bredden efter behov */
            max-width: 900px; /* Maxbredd för att förhindra att videospelaren blir för stor */
            height: auto;
            margin: 40px auto;
        }

        video {
            width: 100%;
            max-height: 50vh; /* Maxhöjd för videospelaren */
            object-fit: contain; /* Förhindrar att videon blir förvrängd */
            border-radius: 15px; /* Rundar kanterna på videospelaren */
        }

        /* Stil för Change Background-knappen */
        #change-background-btn {
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px 20px;
            background-color: #6a0dad;
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        #change-background-btn:hover {
            background-color: #5c0b8a;
        }
    </style>
</body>
</html>
