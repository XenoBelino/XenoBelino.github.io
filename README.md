<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <script src="https://unpkg.com/wavesurfer.js"></script>

    <style>
        /* Grundläggande stilar */
        body {
            font-family: 'Lato', sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            background-color: lightblue;
            transition: background-color 0.5s, color 0.5s;
            position: relative;
        }

        .editor-content {
            text-align: center;
            margin: 20px;
            z-index: 1;
            position: relative;
        }

        /* Bakgrundsval meny */
        #background-options {
            display: none;
            position: absolute;
            top: 50px;
            right: 10px;
            background-color: white;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
            width: 160px;
            z-index: 2;
        }

        /* Knapp färg för alla knappar */
        button {
            background-color: #6a0dad; /* Lila bakgrund */
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #5c0b8a;
        }

        /* För att placera knappen i originalpositionen */
        #change-background-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 2;
        }

        /* Standard bakgrund (Light Mode) */
        .light-mode {
            background: linear-gradient(to bottom, #e0b3e6, #f1c6e7);
        }

        /* Dark Mode bakgrund */
        .dark-mode {
            background: linear-gradient(to bottom, #333, #6a4c9c);
        }

        /* Förstorade stjärnor */
        .star-fall {
            position: absolute;
            width: 20px;
            height: 20px;
            opacity: 0.8;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            z-index: -1;
        }

        /* Förstorade stjärnfall - snedstreck som representerar stjärnfall */
        .falling-star {
            position: absolute;
            width: 4px;
            height: 40px;
            opacity: 0.8;
            transform: rotate(-45deg);
            animation: fall 3s ease-in-out infinite;
            z-index: -1;
        }

        /* Animering för stjärnfall diagonalt */
        @keyframes fall {
            0% {
                transform: translateY(-100px) rotate(-45deg);
            }
            100% {
                transform: translateY(100vh) translateX(100px) rotate(-45deg);
            }
        }

        /* För texten på knappar */
        button {
            font-size: 16px;
            padding: 10px 20px;
        }

        /* Justera hitboxen för texten på knapparna */
        button span {
            display: inline-block;
            padding: 5px;
        }

    </style>
</head>
<body class="light-mode">
    <!-- Stjärnfall animation -->
    <div class="star-fall" style="top: 20px; left: 20px;"></div>
    <div class="star-fall" style="top: 100px; left: 50px;"></div>
    <div class="star-fall" style="top: 300px; left: 200px;"></div>
    
    <div class="editor-content">
        <h1>Welcome to my website</h1>

        <!-- Browse Button -->
        <button onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)" />
        
        <div id="file-info"></div>

        <!-- Go to Page Button -->
        <button id="go-to-page-btn" onclick="window.location.href='page.html'">Go to Page</button>

        <!-- Waveform container -->
        <div id="waveform"></div>

        <!-- Video player -->
        <video id="video-player" width="320" height="240" controls>
            <source src="path_to_video.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>

    <!-- Knappen för att ändra bakgrund -->
    <button id="change-background-btn" onclick="toggleBackgroundOptions()">Change Background</button>
    
    <!-- Options för bakgrundsval -->
    <div id="background-options">
        <button class="light-mode-btn" onclick="setLightMode()">Light Mode</button>
        <button class="dark-mode-btn" onclick="setDarkMode()">Dark Mode</button>
    </div>

    <script>
        function toggleBackgroundOptions() {
            var options = document.getElementById('background-options');
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
        }

        function setLightMode() {
            document.body.className = 'light-mode';
            hideBackgroundOptions();
            updateButtonColors('light-mode');
        }

        function setDarkMode() {
            document.body.className = 'dark-mode';
            hideBackgroundOptions();
            updateButtonColors('dark-mode');
        }

        function updateButtonColors(mode) {
            const lightModeBtn = document.querySelector('.light-mode-btn');
            const darkModeBtn = document.querySelector('.dark-mode-btn');
            if (mode === 'light-mode') {
                lightModeBtn.style.backgroundColor = '#f1c6e7'; 
                darkModeBtn.style.backgroundColor = '#6a4c9c'; 
            } else {
                lightModeBtn.style.backgroundColor = '#6a4c9c'; 
                darkModeBtn.style.backgroundColor = '#FF1493'; 
            }
        }

        function hideBackgroundOptions() {
            document.getElementById('background-options').style.display = 'none';
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
