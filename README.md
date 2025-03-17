<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Editor</title>
    <script src="https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@latest"></script>
    <style>
        /* Lägg till lite grundläggande styling om det behövs */
        #video-container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>

    <!-- Video Player -->
    <div id="video-container">
        <video id="video-player" controls>
            <source id="video-source" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div id="file-name">No file selected</div>
        <button id="browse-btn">Browse</button>
        <input type="file" id="file-input" accept="video/*" style="display: none;">
    </div>

    <!-- Ljudreglage (sliders) -->
    <div id="volume-controls">
        <label for="volume-slider">Volume:</label>
        <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
    </div>

    <!-- Spara ändringar-knapp -->
    <button id="save-btn">Save Changes</button>

    <script>
        // Funktion för att hantera filval
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfo = document.getElementById('file-name');
            const videoPlayer = document.getElementById('video-player');
            const videoSource = videoPlayer.querySelector('source');

            if (file) {
                // Kontrollera att filen är ett accepterat videoformat
                const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mkv'];
                const fileExtension = file.name.split('.').pop().toLowerCase();

                if (validTypes.includes(file.type) || fileExtension === 'mkv') {
                    const fileURL = URL.createObjectURL(file);
                    videoSource.src = fileURL;
                    videoPlayer.load();
                    fileInfo.textContent = `Selected file: ${file.name}`;
                    localStorage.setItem('videoFile', fileURL);
                } else {
                    fileInfo.textContent = 'Please select a valid video file (MP4, WebM, OGG, MKV).';
                }
            } else {
                fileInfo.textContent = 'No file selected';
            }
        }

        // Kalla på när användaren väljer en fil
        document.getElementById('browse-btn').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });

        document.getElementById('file-input').addEventListener('change', handleFileSelect);

        // Funktion för att bearbeta videon och spara ändringar
        async function handleVideoEdit(file) {
            const { createFFmpeg, fetchFile } = FFmpeg;
            const ffmpeg = createFFmpeg({ log: true });

            await ffmpeg.load();

            // Ladda videofilen till FFmpeg
            ffmpeg.FS('writeFile', file.name, await fetchFile(file));

            // Här kan vi exempelvis ändra volymen på videon (justera värdet vid behov)
            await ffmpeg.run('-i', file.name, '-filter:a', 'volume=0.5', 'output.mp4');  // Justera volymen till 50%

            // Hämta den modifierade videofilen
            const data = ffmpeg.FS('readFile', 'output.mp4');

            // Skapa en Blob och en nedladdningslänk
            const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
            const videoURL = URL.createObjectURL(videoBlob);

            // Skapa en länk för nedladdning av den modifierade videon
            const a = document.createElement('a');
            a.href = videoURL;
            a.download = 'edited-video.mp4';
            a.click();
        }

        // Spara ändringar när knappen trycks
        document.getElementById('save-btn').addEventListener('click', function() {
            const videoSource = document.getElementById('video-source');
            const videoFileURL = videoSource.src;

            if (videoFileURL) {
                const videoFile = new File([videoFileURL], 'video.mp4', { type: 'video/mp4' });
                handleVideoEdit(videoFile);
            } else {
                alert("Please select a video file first.");
            }
        });
    </script>
</body>
</html>
