<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease, color 0.3s ease;
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
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        #back-to-home-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
        }

        #save-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }

        /* Placering av "Browse Files" och "No file selected" */
        #file-name {
            color: black;
            font-size: 18px;
            margin-top: 10px; /* Nytt utrymme mellan text och Browse Files-knappen */
        }

        #browse-btn {
            margin-top: 10px; /* Lägg till lite avstånd ovanför Browse Files-knappen */
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

        /* Bakgrundsoptionssliden */
        #background-options {
            display: none;
            position: fixed;
            top: 70px; /* Placeras direkt under knappen */
            right: 20px;
            background-color: #ddd;
            border-radius: 5px;
            padding: 10px;
            width: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            z-index: 100;
        }

        /* Specifik stil för Light Mode / Dark Mode knappar */
        .mode-btn {
            padding: 10px 20px;
            background-color: #6a0dad;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: block;
            margin-bottom: 10px;
        }

        .mode-btn:hover {
            background-color: #5c0b8a;
        }

        /* Light Mode & Dark Mode Styles */
        body.light-mode {
            background-color: #f4f4f4;
            color: black;
        }

        body.dark-mode {
            background-color: #000000; /* Dark Mode bakgrundsfärg */
            color: white;
        }

        /* När Dark Mode är aktiv */
        body.dark-mode #file-name {
            color: white;
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
                <source src="assets/videos/sample.mkv" type="video/x-matroska">
                <source src="assets/videos/sample.webm" type="video/webm">
                Your browser does not support the video tag.
            </video>
        </div>

        <button id="browse-btn" class="browse-button">Browse Files</button>
        <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">
        <div id="file-name">No file selected</div>

        <button id="change-background-btn" class="button">Change Background</button>
        
        <!-- Bakgrundsoptions slider -->
        <div id="background-options">
            <button class="mode-btn" id="light-mode-btn">Light Mode</button>
            <button class="mode-btn" id="dark-mode-btn">Dark Mode</button>
        </div>

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
        // Din JavaScript-kod går här för att hantera funktioner som filuppladdning, volymjustering och bakgrundsändringar
    </script>
</body>
</html>
