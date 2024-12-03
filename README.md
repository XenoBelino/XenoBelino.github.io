<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/wavesurfer.js"></script>

    <style>
        /* Grundläggande styling */
        body {
            font-family: 'Lato', sans-serif;
            background-color: black;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-image: linear-gradient(to right, #4F4A85, #ffffff, #4F4A85); /* Blå, vit och lila bakgrund */
            background-size: cover; /* Fyll hela bakgrunden */
            overflow-y: auto;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            max-width: 100%;
            box-sizing: border-box;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: black;
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
            text-align: left; /* Flyttar rubriken till vänster */
            padding-left: 20px; /* Lägg till lite padding för avstånd från vänster */
        }

        button {
            border-radius: 8px;
            padding: 8px 16px;
            background-color: #4F4A85;
            color: white;
            border: none;
            cursor: pointer;
            margin: 6px;
            font-size: 12px;
            transition: 0.3s;
            width: 120px;
        }

        button:hover {
            background-color: #383351;
        }

        /* Ljudvågor (för audio) - alltid synliga */
        #waveform {
            width: 100%;
            height: 150px;
            background-color: black;  /* Bakgrundsfärg ändrad till svart */
            margin-top: 20px;
            display: block;
        }

        /* Större videospelare - halva storleken från tidigare */
        video {
            margin-top: 20px;
            width: 250%; /* Minskat till 250% */
            height: auto;
            border-radius: 8px;
            display: block;
            background-color: #000;
        }

        #file-info {
            margin-top: 10px;
            color: #4F4A85;
        }

        #volume-slider {
            margin-top: 20px;
            width: 100%;
            max-width: 500px;
        }

        .button-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            justify-content: space-evenly;
            width: 240px;
            z-index: 100;
        }

        #browse-button {
            width: 120px;
            margin-right: 10px;
        }

        /* Återställ stil vid kopiering */
        ::selection {
            background-color: transparent;
            color: white;
        }

        ::-moz-selection {
            background-color: transparent;
            color: white;
        }

    </style>
</head>
<body>
    <div class="editor-content">
        <h1>XenoBelino</h1> <!-- Flyttad rubrik till vänster -->

        <!-- Video player -->
        <video id="video-player" controls>
            <source id="video-source" type="video/mp4">
            Your browser does not support the video tag.
        </video>

        <!-- Volume Slider -->
        <input type="range" min="0" max="100" value="50" id="volume-slider">

        <!-- Waveform (for audio) -->
        <div id="waveform"></div>

        <div id="file-info"></div>
    </div>

    <div class="button-container">
        <button id="save-button" onclick="saveFile()">Save</button>
        <button id="browse-button" onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)">
    </div>

    <script>
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#4F4A85',
            progressColor: '#383351',
            backend: 'WebAudio',
        });

        // Gör så att ljudvågorna alltid visas, även om ingen ljudfil är vald
        wavesurfer.empty = function() {
            document.getElementById('waveform').style.backgroundColor = 'black';
        };

        var slider = document.getElementById("volume-slider");
        slider.oninput = function() {
            wavesurfer.setVolume(slider.value / 100);
        };

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                document.getElementById('file-info').innerText = `Selected file: ${file.name}`;

                if (file.type.startsWith('video')) {
                    const videoPlayer = document.getElementById('video-player');
                    const videoSource = document.getElementById('video-source');

                    if (file.name.to
