<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <link rel="stylesheet" href="styles.css"> <!-- Kontrollera att denna fil finns -->
    <style>
        /* Grundläggande stil för hela sidan */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4; /* Standard Light Mode bakgrundsfärg */
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease; /* Gör bakgrundsändringen smidig */
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

        /* Placering av knappar */
        #change-background-btn {
            position: absolute;
            top: 20px;
            right: 20px;
        }

        #back-to-home-btn {
            position: absolute;
            top: 20px;
            left: 20px;
        }

        #save-btn {
            position: fixed;  /* Gör att knappen är fast i det nedre högra hörnet */
            bottom: 20px;     /* Längst ner på sidan med ett litet avstånd från botten */
            right: 20px;      /* Längst till höger med ett litet avstånd från högerkant */
            z-index: 1000;    /* Ser till att knappen inte hamnar bakom andra element */
        }

        #browse-btn {
            margin-top: 20px;
        }

        /* Stil för videospelaren */
        .video-container {
            margin-top: 30px;
            display: flex;
            justify-content: center;
        }

        #video-player {
            border-radius: 15px;
            width: 80%;  /* Justera till den storlek du vill */
            max-width: 800px; /* Maximal bredd för videospelaren */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        /* Volymreglage */
        .volume-slider-container {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        #file-name {
            color: black;
            font-size: 18px;
        }

    </style>
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
                    // Spara filen i localStorage
                    localStorage.setItem('videoFile', fileURL);
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

        // "Save Changes"-knappens funktion
        document.getElementById('save-btn').addEventListener('click', function() {
            // Spara volyminställningarna i localStorage
            const originalVolume = document.getElementById('original-volume').value;
            const corruptedVolume = document.getElementById('corrupted-volume').value;
            const musicVolume = document.getElementById('music-volume').value;
            const finalVolume = document.getElementById('final-volume').value;

            localStorage.setItem('originalVolume', originalVolume);
            localStorage.setItem('corruptedVolume', corruptedVolume);
            localStorage.setItem('musicVolume', musicVolume);
            localStorage.setItem('finalVolume', finalVolume);

            alert('Changes have been saved!');
        });

        // Återställ volyminställningar och filreferens från localStorage när sidan laddas
        window.addEventListener('load', function() {
            const originalVolume = localStorage.getItem('originalVolume') || 50;
            const corruptedVolume = localStorage.getItem('corruptedVolume') || 50;
            const musicVolume = localStorage.getItem('musicVolume') || 50;
            const finalVolume = localStorage.getItem('finalVolume') || 50;
            const videoFile = localStorage.getItem('videoFile');

            // Återställ volymen
            document.getElementById('original-volume').value = originalVolume;
            document.getElementById('corrupted-volume').value = corruptedVolume;
            document.getElementById('music-volume').value = musicVolume;
            document.getElementById('final-volume').value = finalVolume;

            // Uppdatera procenttexterna
            updateVolumePercentage('original');
            updateVolumePercentage('corrupted');
            updateVolumePercentage('music');
            updateVolumePercentage('final');

            // Återställ videofilen om den finns
            if (videoFile) {
                const videoPlayer = document.getElementById('video-player');
                const videoSource = videoPlayer.querySelector('source');
                videoSource.src = videoFile;
                videoPlayer.load();
            }
        });

        // Volymuppdatering
        function updateVolumePercentage(type) {
            const volumeElement = document.getElementById(`${type}-volume`);
            const volumePercent = document.getElementById(`${type}-volume-percent`);
            const volumeIcon = document.getElementById(`${type}-volume-icon`);
            volumePercent.textContent = `${volumeElement.value}%`;

            const volume = volumeElement.value;

            // Uppdatera ljudsymbolen baserat på volymen
            if (volume == 0) {
                volumeIcon.textContent = "🔇"; // Mute-symbol
            } else if (volume > 0 && volume <= 33) {
                volumeIcon.textContent = "🔈"; // Låg volym (en båge)
            } else if (volume > 33 && volume <= 66) {
                volumeIcon.textContent = "🔉"; // Medium volym (två bågar)
            } else if (volume > 66) {
                volumeIcon.textContent = "🔊"; // Hög volym (tre bågar)
            }
        }

        // Lägg till en eventlistener för att uppdatera volymen direkt vid användarinteraktion
        document.querySelectorAll('.volume-slider').forEach(slider => {
            slider.addEventListener
