<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <style>
        /* Grundläggande stil för hela sidan */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            max-width: 900px;
            margin: auto;
        }

        /* Stil för knappar */
        .button, .browse-button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            background-color: #6a0dad;
            color: white;
            transition: background-color 0.3s;
        }

        .button:hover, .browse-button:hover {
            background-color: #5c0b8a;
        }

        /* Progress bar container */
        #progress-container {
            display: none;
            margin-top: 20px;
        }
        progress {
            width: 100%;
            height: 20px;
        }
    </style>
</head>
<body>
    <div class="editor-content">
        <h1>Välkommen till Video- och Ljudredigeraren!</h1>
        <p>Här kan du ladda upp en video, ändra volyminställningar och justera bakgrunden.</p>

        <!-- Video Player Container -->
        <div class="video-container">
            <video id="video-player" controls>
                <source src="assets/videos/sample.mp4" type="video/mp4">
                <source src="assets/videos/sample.webm" type="video/webm">
                <source src="assets/videos/sample.ogv" type="video/ogg">
                <source src="assets/videos/sample.mkv" type="video/mkv">
                Your browser does not support the video tag.
            </video>
        </div>

        <div id="file-name">No file selected</div>
        <button id="browse-btn" class="browse-button">Browse Files</button>
        <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">

        <button id="convert-btn" class="button">Convert to MP4</button>

        <div id="progress-container">
            <label for="progress-bar">Konvertering pågår:</label>
            <progress id="progress-bar" value="0" max="100"></progress>
            <span id="progress-percent">0%</span>
        </div>
    </div>

    <!-- Lägg till rätt ffmpeg.js -->
    <script src="https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@4.4.0/ffmpeg.min.js"></script>
    
    <script>
        // Filhantering
        function handleFileSelect(event) {
            const fileName = event.target.files[0]?.name || "No file selected";
            document.getElementById("file-name").textContent = fileName;
        }

        // Hantera konvertering till MP4 med ffmpeg.js
        document.getElementById("convert-btn").addEventListener("click", async function() {
            const videoFile = document.getElementById("file-input").files[0];
            if (videoFile) {
                // Skapa en FFmpeg instans
                const ffmpeg = FFmpeg.createFFmpeg({ log: true });
                await ffmpeg.load();

                const fileBuffer = await videoFile.arrayBuffer();
                ffmpeg.FS("writeFile", videoFile.name, new Uint8Array(fileBuffer));

                // Uppdatera progressbar här
                let progressContainer = document.getElementById("progress-container");
                progressContainer.style.display = 'block';
                let progressBar = document.getElementById("progress-bar");

                // Starta konvertering till MP4
                await ffmpeg.run("-i", videoFile.name, "-c:v", "libx264", "-c:a", "aac", "output.mp4", 
                    "-progress", "pipe:1", "-nostats", "-hide_banner");

                const data = ffmpeg.FS("readFile", "output.mp4");

                // Skapa en blob och visa videon
                const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
                const videoUrl = URL.createObjectURL(videoBlob);
                document.getElementById("video-player").src = videoUrl;

                // Progressbar funktion
                let progress = 0;
                let interval = setInterval(() => {
                    if (progress < 100) {
                        progress += 5;
                        progressBar.value = progress;
                        document.getElementById("progress-percent").textContent = `${progress}%`;
                    } else {
                        clearInterval(interval);
                    }
                }, 100);
            }
        });
    </script>
</body>
</html>
