<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body id="background">
    <div id="file-info"></div>
    <div id="media-container"></div>

    <input type="file" id="file-input" onchange="handleFileSelect(event)">
    <button id="change-background-btn">Change Background</button>
    <input type="range" id="volume" min="0" max="1" step="0.01" onchange="adjustVolume()">
    <div id="wavesurfer"></div>

    <script src="scripts.js"></script>
</body>
</html>
