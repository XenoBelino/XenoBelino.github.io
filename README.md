<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <script src="https://unpkg.com/wavesurfer.js"></script>
    <style>
        body {
            font-family: 'Lato', sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            position: relative;
            transition: background-color 0.5s, color 0.5s;
        }

        .editor-content {
            text-align: center;
            margin: 20px;
            z-index: 1;
            position: relative;
        }

        h1 {
            margin-bottom: 0;
        }

        /* Bakgrundsval meny */
        #background-options {
            display: none;
            position: absolute;
            top: 10px;
            left: 0;
            background-color: white;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
            width: 160px;
            z-index: 1000;
        }

        button {
            background-color: #6a0dad; /* Lila bakgrund */
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
            margin: 10px;
        }

        button:hover {
            background-color: #5c0b8a;
        }

        #change-background-btn {
            position: relative;
            top: 10px;
            left: 10px;
            z-index: 1000;
            padding: 10px 20px;
        }

        .light-mode {
            background: linear-gradient(to bottom, #e0b3e6, #f1c6e7);
        }

        .dark-mode {
            background: linear-gradient(to bottom, #333, #6a4c9c);
        }

        .button-container {
            display: flex;
            justify-content: center;
        }

        .light-mode-btn {
            background-color: #f1c6e7; /* Rosa */
        }

        .dark-mode-btn {
            background-color: #6a4c9c; /* Ljuslila */
        }

    </style>
</head>
<body class="light-mode">
    <div class="editor-content">
        <h1>Welcome to my website</h1>

        <!-- Knappar i en container för att undvika överlappning -->
        <div class="button-container">
            <button onclick="document.getElementById('file-input').click()">Browse my files</button>
            <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)" />
            
            <button id="go-to-page-btn" onclick="window.location.href='page.html'">Go to Page</button>

            <button id="change-background-btn" onclick="toggleBackgroundOptions()">Change Background</button>
        </div>

        <!-- Options för bakgrundsval -->
        <div id="background-options">
            <button class="light-mode-btn" onclick="setLightMode()">Light Mode</button>
            <button class="dark-mode-btn" onclick="setDarkMode()">Dark Mode</button>
        </div>
    </div>

    <script>
        // Toggle the background options visibility
        function toggleBackgroundOptions() {
            var options = document.getElementById('background-options');
            if (options.style.display === 'block') {
                options.style.display = 'none';
            } else {
                options.style.display = 'block';
                updateBackgroundOptionsPosition(); // Update the position of the slider
            }
        }

        // Set light mode
        function setLightMode() {
            document.body.className = 'light-mode';
            hideBackgroundOptions();
        }

        // Set dark mode
        function setDarkMode() {
            document.body.className = 'dark-mode';
            hideBackgroundOptions();
        }

        // Hide the background options
        function hideBackgroundOptions() {
            document.getElementById('background-options').style.display = 'none';
        }

        // Update the position of the background options based on the button position
        function updateBackgroundOptionsPosition() {
            var btn = document.getElementById('change-background-btn');
            var options = document.getElementById('background-options');
            var btnRect = btn.getBoundingClientRect();

            options.style.top = (btnRect.bottom + 5) + 'px';  // Place slider directly below the button
            options.style.left = btnRect.left + 'px';  // Align with button on the left
        }

        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfoDiv = document.getElementById('file-info');
            const videoPlayer = document.getElementById('video-player');

            if (file) {
                fileInfoDiv.textContent = `Selected file: ${file.name}`;

                const fileURL = URL.createObjectURL(file);

                let extension = file.name.split('.').pop().toLowerCase();
                if (['mp3', 'wav', 'ogg'].includes(extension)) {
                    // Add audio player functionality here
                } else if (['mp4', 'webm', 'mov'].includes(extension)) {
                    videoPlayer.src = fileURL;
                    videoPlayer.style.display = 'block';
                }
            }
        }
    </script>
</body>
</html>
