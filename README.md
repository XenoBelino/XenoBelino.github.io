<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>XenoBelino</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Grundläggande stilar */
        body {
            font-family: 'Lato', sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            background-color: lightblue;
            transition: background-color 0.5s, color 0.5s;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
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
            width: 60%;
            height: auto;
            margin: 40px auto;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
            display: flex;
            gap: 10px;
            margin-top: 20px;
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

        .file-info {
            color: #fff;
            font-size: 16px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
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
        <div class="volume-slider-container">
            <div class="volume-percentage" id="original-volume-percent">Original: 40%</div>
            <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="40" oninput="updateVolumePercentage('original')">
        </div>

        <div class="volume-slider-container">
            <div class="volume-percentage" id="corrupted-volume-percent">Overwriting Audio: 30%</div>
            <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('corrupted')">
        </div>

        <div class="volume-slider-container">
            <div class="volume-percentage" id="music-volume-percent">Music: 30%</div>
            <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="30" oninput="updateVolumePercentage('music')">
        </div>

        <div class="volume-slider-container">
            <div class="volume-percentage" id="final-volume-percent">Final Result: 70%</div>
            <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="70" oninput="updateVolumePercentage('final')">
        </div>

        <!-- Buttons -->
        <div class="buttons-container">
            <button class="button" id="save-btn">Save</button>
            <button class="button" id="browse-btn">Browse my files</button>
        </div>
    </div>

    <input type="file" id="file-input" style="display: none;" accept="video/mp4,video/webm" onchange="handleFileSelect(event)" />

    <script>
        // Uppdatera volymprocenten och ikoner vid sliderförändring
        function updateVolumePercentage(type) {
            const volumeSlider = document.getElementById(`${type}-volume`);
            const volume = volumeSlider.value;
            const volumePercentage = document.getElementById(`${type}-volume-percent`);
            
            volumePercentage.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${volume}%`;
        }

        // Funktion för att spara volyminställningar till en fil
        document.getElementById("save-btn").addEventListener("click", function() {
            const settings = {
                originalVolume: document.getElementById("original-volume").value,
                corruptedVolume: document.getElementById("corrupted-volume").value,
                musicVolume: document.getElementById("music-volume").value,
                finalVolume: document.getElementById("final-volume").value
            };

            const fileContent = JSON.stringify(settings, null, 2);
            const blob = new Blob([fileContent], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "audio_settings.json";
            a.click();
        });

        // Funktion för att hantera filval
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfo = document.getElementById('file-info');
            const videoPlayer = document.getElementById('video-player');
            const videoSource = document.getElementById('video-source');

            if (file) {
                // Kontrollera om filen är en kompatibel videotyp
                if (file.type === 'video/mp4' || file.type === 'video/webm') {
                    const fileURL = URL.createObjectURL(file);
                    videoSource.src = fileURL;
                    videoPlayer.load();

                    // Uppdatera filnamnet
                    fileInfo.textContent = `Selected file: ${file.name}`;
                } else {
                    // Om filen inte är kompatibel
                    fileInfo.textContent = 'Please select a valid video file (MP4 or WebM).';
                }
            }
        }

        // Trigger för att öppna filväljaren
        document.getElementById('browse-btn').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });
    </script>
</body>
</html>
