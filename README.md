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
            background-color: black; /* Ensuring background is black */
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
        }

        /* Editor content with consistent black background */
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
            background-color: black;  /* Ensure background stays black */
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
        }

        button {
            border-radius: 8px;
            padding: 8px 16px;  /* Reduced button size */
            background-color: #4F4A85;
            color: white;
            border: none;
            cursor: pointer;
            margin: 6px;
            font-size: 12px;
            transition: 0.3s;
            width: 120px;  /* Adjusted button size */
        }

        button:hover {
            background-color: #383351;
        }

        #waveform {
            width: 100%;
            height: 150px;
            background-color: #f0f0f0;
            margin-top: 20px;
            display: none; /* Initially hidden */
        }

        video {
            margin-top: 20px;
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: none;  /* Initially hidden */
            background-color: #000;  /* Background for video element */
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
            width: 240px;  /* Adjusted width of button container */
            z-index: 100;
        }

        #browse-button {
            width: 120px; /* Adjusted button size */
            margin-right: 10px;
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

    <!-- Save and Browse buttons at the bottom-right -->
    <div class="button-container">
        <button id="save-button" onclick="saveFile()">Save</button>
        <button id="browse-button" onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)">
    </div>

    <script>
        // Initialize Wavesurfer instance (for audio files)
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
            if (file) {
                console.log("File selected:", file.name); // For debugging
                document.getElementById('file-info').innerText = `Selected file: ${file.name}`;

                // Check for supported video types
                if (file.type.startsWith('video')) {
                    const videoPlayer = document.getElementById('video-player');
                    const videoSource = document.getElementById('video-source');

                    // Check for MP4, WebM, Ogg and FLV formats
                    if (file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.webm') || file.name.toLowerCase().endsWith('.ogg')) {
                        videoSource.src = URL.createObjectURL(file);
                        videoPlayer.load();
                        videoPlayer.style.display = 'block';  // Show video player
                    } else if (file.name.toLowerCase().endsWith('.flv')) {
                        alert("FLV files are not supported in HTML5. Please convert them to MP4 format.");
                        videoPlayer.style.display = 'none';
                    } else {
                        alert("Unsupported video format. Please upload an MP4, WebM, Ogg video.");
                        videoPlayer.style.display = 'none';
                    }
                } else if (file.type.startsWith('audio')) {
                    // Handle audio files (using WaveSurfer)
                    wavesurfer.load(URL.createObjectURL(file));
                    document.getElementById('video-player').style.display = 'none';  // Hide video player for audio
                } else {
                    alert("Unsupported file type. Please upload a video or audio file.");
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
