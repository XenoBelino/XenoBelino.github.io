<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="editor-content">
        <div class="video-container">
            <video id="video-player" controls>
                <source src="assets/videos/sample.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>

        <button id="browse-btn" class="browse-button">Browse Files</button>
        <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">
        <div id="file-name">No file selected</div>

        <button id="change-background-btn" class="button">Change Background</button>
        <button id="save-btn" class="button">Save Settings</button>

        <!-- Logga besök -->
        <div id="visitor-count">Antal besökare: <span id="visitor-count-value">0</span></div>

        <script>
            // Föregående säkerhetsåtgärder för att skydda koden
            if (window.location.protocol !== "https:") {
                alert("Denna webbplats kräver säker anslutning!");
            }

            // Hantera besök
            const visitorCount = localStorage.getItem('visitorCount') || 0;
            document.getElementById('visitor-count-value').textContent = visitorCount;
            localStorage.setItem('visitorCount', parseInt(visitorCount) + 1);
        </script>
    </div>
</body>
</html>
