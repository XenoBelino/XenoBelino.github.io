<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            max-width: 900px;
            margin: auto;
        }

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

        #save-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }

        #progress-container {
            display: none;
            margin-top: 20px;
        }

        progress {
            width: 100%;
            height: 20px;
        }

        .video-container {
            margin-top: 30px;
            display: flex;
            justify-content: center;
        }

        #video-player {
            border-radius: 15px;
            width: 80%;
            max-width: 800px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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

        <button id="save-btn" class="button">Save Changes</button>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.js/4.1.0/ffmpeg.min.js"></script>
    <script>
        let videoFile = null;

        // Filhantering
        function handleFileSelect(event) {
            videoFile = event.target.files[0];
            const fileName = videoFile ? videoFile.name : "No file selected";
            document.getElementById("file-name").textContent = fileName;

            // Lägg till källan för den uppladdade videon
            if (videoFile) {
                const videoUrl = URL.createObjectURL(videoFile);
                document.getElementById("video-player").src = videoUrl;
            }
        }

        // Konvertera till MP4 med FFmpeg
        document.getElementById("convert-btn").addEventListener("click", async function() {
            if (!videoFile) {
                alert("Please upload a video first!");
                return;
            }

            // Visa progressbaren
            const progressContainer = document.getElementById("progress-container");
            progressContainer.style.display = 'block';

            const progressBar = document.getElementById("progress-bar");
            const progressPercent = document.getElementById("progress-percent");

            // Skapa en FFmpeg instans
            const ffmpeg = FFmpeg.createFFmpeg({ log: true });
            await ffmpeg.load();

            // Läs in videofilen och skriv till FFmpeg-filsystemet
            const fileBuffer = await videoFile.arrayBuffer();
            ffmpeg.FS("writeFile", videoFile.name, new Uint8Array(fileBuffer));

            // Uppdatera progressbar under konverteringen
            let progress = 0;
            let interval = setInterval(() => {
                progress += 5;
                progressBar.value = progress;
                progressPercent.textContent = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 100);

            // Konvertera video till MP4
            await ffmpeg.run("-i", videoFile.name, "-c:v", "libx264", "-c:a", "aac", "output.mp4");

            // Läs ut den konverterade filen
            const data = ffmpeg.FS("readFile", "output.mp4");

            // Skapa en Blob för den konverterade videon
            const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
            const videoUrl = URL.createObjectURL(videoBlob);

            // Uppdatera videospelaren med den nya MP4-filen
            document.getElementById("video-player").src = videoUrl;
        });
    </script>
</body>
</html>
