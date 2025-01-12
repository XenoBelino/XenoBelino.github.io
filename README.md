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
            transition: background-color 0.5s, color 0.5s;
        }

        /* För att placera knappen i originalpositionen */
        #change-background-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #800080; /* Lila bakgrundsfärg */
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
            z-index: 2;
        }

        /* Bakgrund för knapp när man är i Light Mode */
        .light-mode-btn {
            background-color: #f1c6e7; /* Ljusrosa */
        }

        /* Bakgrund för knapp när man är i Dark Mode */
        .dark-mode-btn {
            background-color: #6a4c9c; /* Mörk lila */
        }

        /* Standard bakgrund (Light Mode) */
        .light-mode {
            background: linear-gradient(to bottom, #e0b3e6, #f1c6e7);
            position: relative;
        }

        /* Dark Mode bakgrund */
        .dark-mode {
            background: linear-gradient(to bottom, #333, #6a4c9c);
            position: relative;
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

        /* Styling för videospelaren */
        #video-player {
            border-radius: 15px;
            display: block;
            margin: 20px auto;
            width: 320px;
            height: 240px;
        }
    </style>
</head>
<body class="light-mode">
    <div class="editor-content">
        <h1>Welcome to my website</h1>
        <button onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)" />
        <div id="file-info"></div>
        <button id="go-to-page-btn" onclick="window.location.href='page.html'">Go to Page</button>
        <div id="waveform"></div>
        <video id="video-player" width="320" height="240" controls>
            <source src="path_to_video.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>

    <button id="change-background-btn" onclick="toggleBackgroundOptions()">Change Background</button>
    
    <div id="background-options">
        <button class="light-mode-btn" onclick="setLightMode()">Light Mode</button>
        <button class="dark-mode-btn" onclick="setDarkMode()">Dark Mode</button>
    </div>

    <script>
        let starContainer = null;
        
        // Skapa stjärnorna när sidan laddas
        function createStars() {
            starContainer = document.createElement('div');
            document.body.appendChild(starContainer);
            for (let i = 0; i < 50; i++) {
                let star = document.createElement('div');
                star.classList.add('star-fall');
                star.style.left = `${Math.random() * 100}vw`;
                star.style.animationDuration = `${Math.random() * 3 + 2}s`;
                starContainer.appendChild(star);
            }
        }

        // Ta bort stjärnorna
        function clearStars() {
            if (starContainer) {
                starContainer.innerHTML = '';
            }
        }

        // Växla bakgrundsoptioner
        function toggleBackgroundOptions() {
            var options = document.getElementById('background-options');
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
        }

        // Aktivera Light Mode
        function setLightMode() {
            document.body.className = 'light-mode';
            clearStars(); // Rensa stjärnorna
            createStars(); // Skapa stjärnor för Light Mode
            hideBackgroundOptions();
            updateButtonColors('light-mode');
        }

        // Aktivera Dark Mode
        function setDarkMode() {
            document.body.className = 'dark-mode';
            clearStars(); // Rensa stjärnorna
            createStars(); // Skapa stjärnor för Dark Mode
            hideBackgroundOptions();
            updateButtonColors('dark-mode');
        }

        // Uppdatera knappfärger
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

        // Stäng bakgrundsoptionsmeny
        function hideBackgroundOptions() {
            document.getElementById('background-options').style.display = 'none';
        }

        // Hantera filval
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfoDiv = document.getElementById('file-info');
            const videoPlayer = document.getElementById('video-player');

            if (file) {
                fileInfoDiv.textContent = `Selected file: ${file.name}`;
                const fileURL = URL.createObjectURL(file);
                let extension = file.name.split('.').pop().toLowerCase();
                if (['mp3', 'wav', 'ogg'].includes(extension)) {
                    // Lägg till ljudspelarfunktionalitet här
                } else if (['mp4', 'webm', 'mov'].includes(extension)) {
                    videoPlayer.src = fileURL;
                    videoPlayer.style.display = 'block';
                }
            }
        }

        // Skapa stjärnor när sidan laddas
        window.onload = function() {
            createStars();
        };
    </script>
</body>
</html>
