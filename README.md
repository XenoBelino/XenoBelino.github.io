<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" as="font" type="font/woff2" crossorigin="anonymous">
    <script src="https://unpkg.com/wavesurfer.js"></script>

    <style>
        body {
            font-family: 'Lato', sans-serif;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-image: linear-gradient(to right, #4F4A85, #ffffff, #4F4A85);
            background-size: cover;
            overflow-y: auto;
        }

        .editor-content {
            text-align: left;
            padding: 20px;
            max-width: 100%;
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 20px;
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
        }

        video {
            margin-top: 20px;
            width: 70%; /* Adjusted to center the video player */
            height: auto;
            border-radius: 8px;
            display: block;
            background-color: #000;
        }

        .volume-slider-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .volume-slider {
            width: 100px;
            margin-bottom: 5px;
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
        }
    </style>
</head>
<body>
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <!-- Video player -->
        <video id="video-player" controls>
            <source id="video-source" type="video/mp4">
            Your browser does not support the video tag.
        </video>

        <!-- Audio waveforms -->
        <div id="waveform"></div>

        <!-- File Information -->
        <div id="file-info"></div>
    </div>

    <div class="section-container">
        <div class="section">
            <div class="section-text">Your original file</div>
            <div class="volume-slider-container">
                <div class="volume-percentage" id="original-volume-percent">50%</div>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('original')">
            </div>
        </div>
        <div class="section">
            <div class="section-text">Overwriting audio / corrupted audio</div>
            <div class="volume-slider-container">
                <div class="volume-percentage" id="corrupted-volume-percent">50%</div>
                <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('corrupted')">
            </div>
        </div>
        <div class="section">
            <div class="section-text">The Music from your file</div>
            <div class="volume-slider-container">
                <div class="volume-percentage" id="music-volume-percent">50%</div>
                <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('music')">
            </div>
        </div>
        <div class="section">
            <div class="section-text">The Final Result</div>
            <div class="volume-slider-container">
                <div class="volume-percentage" id="final-volume-percent">50%</div>
                <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="50" onchange="updateVolumePercentage('final')">
            </div>
        </div>
    </div>

    <script>
        // Function to update volume percentage
        function updateVolumePercentage(type) {
            const volume = document.getElementById(`${type}-volume`).value;
            document.getElementById(`${type}-volume-percent`).textContent = volume + "%";
        }
    </script>
</body>
</html>
