<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
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
                <source src="assets/videos/sample.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- Knappar för bakgrundsändring och spara inställningar -->
        <button id="change-background-btn" class="button">Change Background</button>

        <!-- Volymreglage -->
        <div class="volume-slider-container">
            <div>
                <label for="original-volume">Original Volume:</label>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('original')">
                <span id="original-volume-percent" class="volume-percentage">50%</span>
            </div>
        </div>

        <!-- Navigeringsknappar -->
        <button id="back-to-home-btn" class="button back-button">Back to Home Page</button>
    </div>

    <script>
        // Hantera bakgrundsändring
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
</body>
</html>
