<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <link rel="stylesheet" href="styles.css"> <!-- Länka till styles.css -->
</head>
<body>
    <div class="editor-content">
        <!-- Video Player Container -->
        <div class="video-container">
            <video id="video-player" controls>
                <source src="assets/videos/sample.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- File Selection and File Info -->
        <button id="browse-btn" class="browse-button">Browse Files</button>
        <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">
        <div id="file-name">No file selected</div>

        <!-- Buttons for Background Change and Volumes -->
        <button id="change-background-btn" class="button">Change Background</button>
        <button id="save-btn" class="button">Save Settings</button>

        <!-- Volume Controls -->
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

        <!-- Buttons for Navigation -->
        <button id="back-to-home-btn" class="button back-button">Back to Home Page</button>
        <button id="go-to-page-btn" class="button back-button">Go to Page</button>
    </div>

    <script src="scripts.js" defer></script> <!-- Länka till scripts.js -->
</body>
</html>
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

        .video-container {
            width: 60%;
            height: auto;
            margin: 40px auto;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .editor-content {
            text-align: left;
            padding: 20px;
            width: 100%;
            flex: 1;
            background-color: transparent;
            border-radius: 10px;
        }

        /* Buttons container */
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

        input[type="file"] {
            display: none;
        }

        /* Information about the file selected */
        #file-info {
            color: white;
            font-size: 16px;
            margin-top: 20px;
        }

    </style>
</head>
<body>

    <!-- Video container to play the selected file -->
    <div class="video-container">
        <video controls id="video-player">
            <source id="video-source" src="videos/video.mp4" type="video/mp4">
            Din webbläsare stödjer inte videospelaren.
        </video>
    </div>

    <!-- Information about the selected file -->
    <div id="file-info">No file selected</div>

    <!-- Buttons container -->
    <div class="buttons-container">
        <button class="button" id="browse-btn">Browse my files</button>
    </div>

    <!-- Hidden file input element -->
    <input type="file" id="file-input" accept="video/mp4,video/webm" onchange="handleFileSelect(event)" />

    <script>
        // Handle file selection and display information about the selected file
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfo = document.getElementById('file-info');
            const videoPlayer = document.getElementById('video-player');
            const videoSource = document.getElementById('video-source');

            if (file) {
                // If it's a valid video file
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

        // Trigger file input when the button is clicked
        document.getElementById('browse-btn').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });
    </script>

</body>
</html>
// Tilldela eventlisteners för knapparna
document.getElementById("back-to-home-btn").addEventListener("click", function() {
    window.location.href = "index.html"; // Gå tillbaka till hemsidan (eller anpassa till din riktiga hemsida)
});

document.getElementById("go-to-page-btn").addEventListener("click", function() {
    window.location.href = "another-page.html"; // Gå till en annan sida (ändra URL till den sidan du vill länka till)
});
