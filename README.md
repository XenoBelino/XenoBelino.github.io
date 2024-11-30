<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link rel="preload" href="https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <script src="https://unpkg.com/wavesurfer.js"></script>
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

        <div id="waveform"></div>
        <input type="range" min="0" max="100" value="50" id="volume-slider">
        
        <!-- Video player -->
        <video id="video-player" width="320" height="240" controls>
            <source src="path_to_video.mp4" type="video/mp4">
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
            // You can add additional logic here to handle file saving.
        }
    </script>
</body>
</html>
