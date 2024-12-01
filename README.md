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
            background-color: lightblue;
            margin: 0;
            padding: 0;
        }
        
        .editor-content {
            text-align: center;
            padding: 20px;
        }

        button {
            border-radius: 8px; /* Runda hörn på knappar */
            padding: 10px 20px;
            background-color: #4F4A85;
            color: white;
            border: none;
            cursor: pointer;
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
        }

        #file-info {
            margin-top: 10px;
        }
    </style>
</head>
<body class="home">
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <!-- Browse Button -->
        <button onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)">
        
        <div id="file-info"></div>

        <!-- Save Button -->
        <button id="save-button" onclick="saveFile()">Save</button>

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

    <script>
        // Initialize Wavesurfer instance
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#4F4A85',
            progressColor: '#383351',
            backend: 'MediaElement',
        });

        // Handle volume control for audio files
        var slider = document.getElementById("volume-slider");
        slider.oninput = function() {
            wavesurfer.setVolume(slider.value / 100);
        };

        // Handle file selection and load media
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfoDiv = document.getElementById('file-info');
            const videoPlayer = document.getElementById('video-player');
            const mediaContainer = document.getElementById('media-container');

            if (file) {
                fileInfoDiv.textContent = `Selected file: ${file.name}`;

                // Create a URL for the selected file
                const fileURL = URL.createObjectURL(file);

                let extension = file.name.split('.').pop().toLowerCase();
                if (['mp3', 'wav', 'ogg'].includes(extension)) {
                    // Handle audio files
                    const mediaElement = document.createElement('audio');
                    mediaElement.src = fileURL;
                    mediaContainer.innerHTML = ''; // Clear previous content
                    mediaContainer.appendChild(mediaElement);

                    // Load the audio with Wavesurfer
                    wavesurfer.load(mediaElement.src);
                } else if (['mp4', 'webm', 'avi'].includes(extension)) {
                    // Handle video files
                    videoPlayer.src = fileURL;
                    videoPlayer.load(); // Reload video source
                } else {
                    fileInfoDiv.textContent = "Unsupported file type!";
                }
            }
        }

        // Save file logic
        function saveFile() {
            alert("Your changes have been saved!");
        }
    </script>
</body>
</html>
