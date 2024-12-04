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
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-image: linear-gradient(to right, #4F4A85, #ffffff, #4F4A85); /* Bakgrundsfärger */
            background-size: cover;
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
            padding-top: 20px;
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
            text-align: left;
            padding-left: 20px;
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

        /* Sektioner för ljud och video */
        .section-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            display: flex;
            flex-direction: column; /* Vertikal ordning */
            align-items: flex-start;
        }

        .section {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
        }

        .section-text {
            color: #4F4A85;
            margin-right: 15px;
            font-size: 18px;
            font-weight: bold;
            text-align: left;
            width: 200px;
        }

        .volume-slider-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end; /* Ljudkontroller till höger */
        }

        .volume-slider {
            width: 100px;
            margin-bottom: 5px;
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
        }

        /* Ljudvågor (för audio) */
        #waveform {
            width: 100%;
            height: 150px;
            background-color: transparent;
            margin-top: 20px;
            display: block;
        }

        video {
            margin-top: 10px;
            width: 80%; /* Förstorad videobredd */
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
    </style>
</head>
<body>
    <div class="editor-content">
        <h1>Edit Your Files</h1>  <!-- Rubrik ändrad -->

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

    <!-- Sektioner för filhantering och ljudjustering -->
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

        // Initiera ljudvågorna när användaren interagerar
        document.body.addEventListener('click', function() {
            wavesurfer.load('path/to/your/audio/file');
        });

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                document.getElementById('file-info').innerText = `Selected file: ${file.name}`;

                if (file.type.startsWith('video')) {
                    const videoPlayer = document.getElementById('video-player');
                    const videoSource = document.getElementById('video-source');
                    videoSource.src = URL.createObjectURL(file);
                    videoPlayer.load();
                    videoPlayer.style.display = 'block';
                    document.getElementById('waveform').style.display = 'none';  // Dölj ljudvågorna när video visas
                } else if (file.type.startsWith('audio')) {
                    wavesurfer.load(URL.createObjectURL(file));
                    document.getElementById('video-player').style.display = 'none';
                    document.getElementById('waveform').style.display = 'block';  // Visa ljudvågorna för ljudfiler
                } else {
                    alert("Unsupported file type.");
                    document.getElementById('waveform').style.display = 'none';
                }
            }
        }

        // Uppdatera volymprocent
        function updateVolumePercentage(type)
