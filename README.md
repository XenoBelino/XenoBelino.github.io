<html lang="en">
<head>
    <div id="waveform"></div>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link rel="preload" href="https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<script src="https://unpkg.com/wavesurfer.js"></script>
<input type="range" min="0" max="100" value="50" id="volume-slider">
<script>
  var slider = document.getElementById("volume-slider");
  var wavesurfer = WaveSurfer.create({ container: '#waveform' });

  slider.oninput = function() {
    wavesurfer.setVolume(slider.value / 100);
  };
</script>
<video id="video-player" width="320" height="240" controls>
  <source src="path_to_video.mp4" type="video/mp4">
  Your browser does not support the video tag.
<video id="video-player" width="320" height="240" controls>
  <source src="path_to_video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
  var video = document.getElementById('video-player');
  video.addEventListener('click', function() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
</script>

</head>
<body class="home"> <!-- Använd klassen home här -->
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <!-- Browse Button -->
        <button onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)">
        
        <div id="file-info"></div>

        <!-- Save Button -->
        <button id="save-button" onclick="saveFile()">Save</button>
    </div>

    <script>
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfoDiv = document.getElementById('file-info');
            
            if (file) {
                fileInfoDiv.textContent = `Selected file: ${file.name}`;
                // Här kan du lägga till kod för att visualisera ljudfilen eller videon.
            }
        }

        function saveFile() {
            alert("Your changes have been saved!");
            // Här kan du lägga till kod för att spara filen eller ändra den.
        }
   function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileInfoDiv = document.getElementById('file-info');
    
    if (file) {
        fileInfoDiv.textContent = `Selected file: ${file.name}`;
        
        // Skapa en URL för den valda filen
        const fileURL = URL.createObjectURL(file);
        
        // Hitta video-elementet och uppdatera src
        const videoPlayer = document.getElementById('video-player');
        const videoSource = videoPlayer.querySelector('source');
        videoSource.src = fileURL; // Sätt den valda filen som src
        
        // Uppdatera video och ladda om den
        videoPlayer.load(); // Detta tvingar webbläsaren att ladda om videon
    }
}
<link rel="preload" href="https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2" as="font" type="font/woff2" crossorigin="anonymous" />

    </script>
</body>
function adjustVolume(trackType) {
    let volumeControl = null;
    if (trackType === 'original') {
        volumeControl = document.getElementById('volume-original');
    } else if (trackType === 'hooks') {
        volumeControl = document.getElementById('volume-hooks');
    } else if (trackType === 'final') {
        volumeControl = document.getElementById('volume-final');
    }

    if (mediaElement) {
        mediaElement.volume = volumeControl.value;
    }
}
let wavesurfer;
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileInfoDiv = document.getElementById('file-info');
    const mediaContainer = document.getElementById('media-container');

    if (file) {
        fileInfoDiv.textContent = `Selected file: ${file.name}`;
        let extension = file.name.split('.').pop().toLowerCase();
        
        // Clear previous media
        mediaContainer.innerHTML = '';

        if (['mp3', 'wav', 'ogg'].includes(extension)) {
            // Initialize Wavesurfer for audio files
            const mediaElement = document.createElement('audio');
            mediaElement.src = URL.createObjectURL(file);
            mediaContainer.appendChild(mediaElement);
            
            // Create the Wavesurfer instance
            wavesurfer = WaveSurfer.create({
                container: '#waveform',
                waveColor: '#4F4A85',
                progressColor: '#383351',
                backend: 'MediaElement',
                mediaElement: mediaElement,
            });

            wavesurfer.load(mediaElement.src); // Load the selected audio file
        } else if (['mp4', 'webm', 'avi'].includes(extension)) {
            // Video element
            const mediaElement = document.createElement('video');
            mediaElement.controls = true;
            mediaElement.src = URL.createObjectURL(file);
            mediaContainer.appendChild(mediaElement);
        } else {
            fileInfoDiv.textContent = "Unsupported file type!";
        }
    }
}

