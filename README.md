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
        body {
            font-family: 'Lato', sans-serif;
            background-color: black;
            color: white;
            margin: 0;
            padding: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            max-width: 100%;
            box-sizing: border-box;
            flex: 1;
            z-index: 1;
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
        }

        button {
            border-radius: 8px;
            padding: 10px 20px;
            background-color: #4F4A85;
            color: white;
            border: none;
            cursor: pointer;
            margin: 10px;
        }

        button:hover {
            background-color: #383351;
        }

        #waveform {
            width: 100%;
            height: 150px;
            background-color: #f0f0f0;
            margin-top: 20px;
        }

        video {
            margin-top: 20px;
            max-width: 100%;
            height: auto;
            border-radius: 8px;
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
            justify-content: space-between;
            width: 250px;
            z-index: 100;
            padding: 10px;
            margin-bottom: 10px;
        }

        #browse-button {
            width: 120px;
            margin-right: 10px;
        }

        /* För att undvika att knappar döljs på grund av layout-problem */
        .editor-content, .button-container {
            z-index: 10; /* Se till att knappar är överst */
        }
    </style>
</head>
<body>
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <!-- Browse Button -->
        <button id="browse-button" onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)" accept="video/*,audio/*,image/*">
        
        <div id="file-info"></div>

        <!-- Volume Slider -->
        <input type="range" min="0" max="100" value="50" id="volume-slider">

        <!-- Waveform -->
        <div id="waveform"></div>

        <!-- Video player -->
        <video id="video-player" controls>
            <source id="video-source" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>

    <!-- Save Button in bottom-right -->
    <div class="button-container">
        <button id="save-button" onclick="saveFile()">Save</button>
    </div>

    <script>
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#4F4A85',
            progressColor: '#383351',
            backend: 'MediaElement',
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
                    videoSource.src = URL.createObjectURL(file);
                    videoPlayer.load();
                    videoPlayer.style.display = 'block';  // Show video player

                    videoPlayer.onerror = function() {
                        document.getElementById('file-info').innerText = "Error loading video.";
                    };
                }

                if (file.type.startsWith('audio')) {
                    wavesurfer.load(URL.createObjectURL(file));
                }
            }
        }

        // Function to save the file (stub for now)
        function saveFile() {
            alert("Saving file functionality not yet implemented.");
        }
    </script>
</body>
</html>
