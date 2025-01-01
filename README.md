<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <button class="back-button" onclick="window.location.href = 'index.html'">Back to Homepage</button>

    <button class="change-background-btn" onclick="toggleBackground()">Change Background</button>

    <div class="editor-content">
        <div class="video-container">
            <video controls id="video-player">
                <source id="video-source" src="videos/video.mp4" type="video/mp4">
                Your browser does not support the video player.
            </video>
        </div>

        <div class="file-info" id="file-info">No file selected</div>

        <div class="section-container">
            <!-- Volume control sections for original, corrupted, music, and final result go here -->
        </div>
    </div>

    <div class="buttons-container">
        <button class="button" id="save-btn">Save</button>
        <button class="button" id="browse-btn">Browse my files</button>
    </div>

    <input type="file" id="file-input" style="display: none;" accept="video/mp4,video/webm" onchange="handleFileSelect(event)" />

    <script src="scripts.js"></script>
</body>
</html>
