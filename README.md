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
            overflow-y: auto;  /* Möjliggör att scrolla om innehållet är för stort */
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
            background-color: #f0f0f0;
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
            background-color: #4F4A85;
            color: white;
        }

        ::-moz-selection {
            background-color: #4F4A85;
            color: white;
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
            backend: 'WebAudio', // Byt till WebAudio istället för MediaElement
        });

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

                    if (file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.webm') || file.name.toLowerCase().endsWith('.ogg')) {
                        videoSource.src = URL.createObjectURL(file);
                        videoPlayer.load();
                        videoPlayer.style.display = 'block';
                        document.getElementById('waveform').style.display = 'none';  // Dölj ljudvågorna när video visas
                    } else if (file.name.toLowerCase().endsWith('.flv')) {
                        alert("FLV files are not supported in HTML5.");
                        videoPlayer.style.display = 'none';
                    } else {
                        alert("Unsupported video format.");
                        videoPlayer.style.display = 'none';
                    }
                } else if (file.type.startsWith('audio')) {
                    // Ladda ljudfilen och visa ljudvågorna
                    wavesurfer.load(URL.createObjectURL(file));
                    document.getElementById('video-player').style.display = 'none';
                    document.getElementById('waveform').style.display = 'block';  // Visa ljudvågorna
                } else {
                    alert("Unsupported file type.");
                }
            }
        }

        function saveFile() {
            alert("Saving file functionality not yet implemented.");
        }
    </script>
</body>
</html>
