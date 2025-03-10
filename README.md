<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Grundläggande stil för hela sidan */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease;
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
            position: fixed; /* Fixerad position för att hålla den på plats */
            top: 20px;
            right: 20px;
            z-index: 1000; /* Säkerställ att knappen inte hamnar bakom andra element */
        }

        #back-to-home-btn {
            position: fixed; /* Fixerad position för att hålla den på plats */
            top: 20px;
            left: 20px;
            z-index: 1000;
        }

        #save-btn {
            position: fixed;  /* Fixerad position för att hålla den längst ned till höger */
            bottom: 20px;
            right: 20px;
            z-index: 1000;
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
            width: 80%;
            max-width: 800px;
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

        <button id="browse-btn" class="browse-button">Browse Files</button>
        <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">
        <div id="file-name">No file selected</div>

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

        <button id="back-to-home-btn" class="button back-button">Back to Home Page</button>
    </div>

    <script>
        // Funktion för att hantera filval
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

        // Kalla på när användaren väljer en fil
        document.getElementById('browse-btn').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });

        // Förändring av bakgrundsläge
        document.getElementById("change-background-btn").addEventListener("click", function() {
            const mode = confirm("Choose background mode:\n\nClick 'OK' for Dark Mode\nClick 'Cancel' for Light Mode");

            if (mode) {
                document.body.style.backgroundColor = "black";
                document.body.style.color = "white";
            } else {
                document.body.style.backgroundColor = "#f4f4f4";
                document.body.style.color = "black";
            }
        });

        // Funktion för att uppdatera volymprocent
        function updateVolumePercentage(type) {
            const volumeElement = document.getElementById(`${type}-volume`);
            const volumePercent = document.getElementById(`${type}-volume-percent`);
            const volumeIcon = document.getElementById(`${type}-volume-icon`);
            volumePercent.textContent = `${volumeElement.value}%`;

            const volume = volumeElement.value;

            if (volume == 0) {
                volumeIcon.textContent = "🔇"; // Mute
            } else if (volume > 0 && volume <= 33) {
                volumeIcon.textContent = "🔈"; // Low volume
            } else if (volume > 33 && volume <= 66) {
                volumeIcon.textContent = "🔉"; // Medium volume
            } else if (volume > 66) {
                volumeIcon.textContent = "🔊"; // High volume
            }
        }

        // Återställ volyminställningar och filreferens från localStorage när sidan laddas
        window.addEventListener('load', function() {
            const originalVolume = localStorage.getItem('originalVolume') || 50;
            const corruptedVolume = localStorage.getItem('corruptedVolume') || 50;
            const musicVolume = localStorage.getItem('musicVolume') || 50;
            const finalVolume = localStorage.getItem('finalVolume') || 50;
            const videoFile = localStorage.getItem('videoFile');

            document.getElementById('original-volume').value = originalVolume;
            document.getElementById('corrupted-volume').value = corruptedVolume;
            document.getElementById('music-volume').value = musicVolume;
            document.getElementById('final-volume').value = finalVolume;

            updateVolumePercentage('original');
            updateVolumePercentage('corrupted');
            updateVolumePercentage('music');
            updateVolumePercentage('final');

            if (videoFile) {
                const videoPlayer = document.getElementById('video-player');
                const videoSource = videoPlayer.querySelector('source');
                videoSource.src = videoFile;
                videoPlayer.load();
            }
        });

        // "Save Changes"-knappens funktion
        document.getElementById('save-btn').addEventListener('click', function() {
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
    </script>
</body>
</html>
