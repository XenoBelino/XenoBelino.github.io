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
        }

        .editor-content {
            text-align: center;
            margin: 20px;
            z-index: 1;
            position: relative;
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

        /* Drop-down meny för att välja bakgrund */
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
        }

        #background-options button {
            width: 100%;
            padding: 8px;
            background-color: #fff;
            border: 1px solid #ddd;
            margin: 5px 0;
            cursor: pointer;
        }

        #background-options button:hover {
            background-color: #f1f1f1;
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
            width: 40px;
            height: 40px;
            opacity: 0.8;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            z-index: -1;
        }

        /* Förstorade stjärnfall - snedstreck som representerar stjärnfall */
        .falling-star {
            position: absolute;
            width: 5px;
            height: 50px;
            opacity: 0.8;
            transform: rotate(-45deg);
            animation: fall 1.5s ease-in-out infinite;
            z-index: -1;
        }

        /* Animering för stjärnfall */
        @keyframes fall {
            0% {
                transform: translateY(-100px) rotate(-45deg);
            }
            100% {
                transform: translateY(100vh) rotate(-45deg);
            }
        }

        /* Bakgrund för knapp när man är i Light Mode */
        .light-mode-btn {
            background-color: #f1c6e7; /* Ljusrosa */
        }

        /* Bakgrund för knapp när man är i Dark Mode */
        .dark-mode-btn {
            background-color: #6a4c9c; /* Mörk lila */
        }
    </style>
</head>
<body class="light-mode">
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <!-- Browse Button -->
        <button onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)" />
        
        <div id="file-info"></div>
        
        <!-- Save Button -->
        <button id="save-button" onclick="saveFile()">Save</button>

        <!-- Volume Slider -->
        <input type="range" min="0" max="100" value="50" id="volume-slider" />

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

    <!-- Stjärnor och stjärnfall -->
    <div class="stars"></div>

    <script>
        // Toggle för bakgrundsinställningar
        function toggleBackgroundOptions() {
            var options = document.getElementById('background-options');
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
        }

        // Light Mode bakgrund
        function setLightMode() {
            document.body.className = 'light-mode';
            generateStars('#ADD8E6', '#f1c6e7'); // Ljusblå stjärnor
            hideBackgroundOptions();
            updateButtonColors('light-mode');
        }

        // Dark Mode bakgrund
        function setDarkMode() {
            document.body.className = 'dark-mode';
            generateStars('#FF1493', '#6a4c9c'); // Rosa stjärnor
            hideBackgroundOptions();
            updateButtonColors('dark-mode');
        }

        // Uppdatera knapparnas bakgrundsfärg beroende på läge
        function updateButtonColors(mode) {
            const lightModeBtn = document.querySelector('.light-mode-btn');
            const darkModeBtn = document.querySelector('.dark-mode-btn');

            if (mode === 'light-mode') {
                lightModeBtn.style.backgroundColor = '#f1c6e7'; // Ljusrosa
                darkModeBtn.style.backgroundColor = '#6a4c9c'; // Mörk lila
            } else {
                lightModeBtn.style.backgroundColor = '#6a4c9c'; // Mörk lila
                darkModeBtn.style.backgroundColor = '#FF1493'; // Rosa
            }
        }

        // Döljer dropdown-menyn efter val av bakgrund
        function hideBackgroundOptions() {
            document.getElementById('background-options').style.display = 'none';
        }

        // Generera stjärnor på skärmen
        function generateStars(starColor, bgColor) {
            let starCount = 100;
            let container = document.querySelector('.stars');
            container.innerHTML = '';  // Rensa tidigare stjärnor
            let positions = [];  // För att hålla koll på stjärnornas positioner

            for (let i = 0; i < starCount; i++) {
                let star = document.createElement('div');
                star.classList.add('star-fall');
                let top, left;

                // Kontrollera så att stjärnorna inte krockar med varandra
                do {
                    top = Math.random() * 100;
                    left = Math.random() * 100;
                } while (positions.some(pos => Math.abs(pos.top - top) < 5 && Math.abs(pos.left - left) < 5));

                positions.push({ top, left });

                star.style.top = `${top}%`;
                star.style.left = `${left}%`;
                star.style.backgroundColor = starColor;

                container.appendChild(star);
            }

            // Generera stjärnfall
            for (let i = 0; i < 20; i++) {
                let fallingStar = document.createElement('div');
                fallingStar.classList.add('falling-star');
                fallingStar.style.top = `${Math.random() * 20}%`;
                fallingStar.style.left = `${Math.random() * 100}%`;
                container.appendChild(fallingStar);
            }
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
                    wavesurfer.load(fileURL);
                } else if (['mp4', 'webm', 'avi'].includes(extension)) {
                    videoPlayer.src = fileURL;
                    videoPlayer.load(); // Ladda om videon
                } else {
                    fileInfoDiv.textContent = "Unsupported file type!";
                }
            }
        }

        // Spara fil (exempel)
        function saveFile() {
            alert("Your changes have been saved!");
        }

        // Ljudkontroller
        var slider = document.getElementById("volume-slider");
        var wavesurfer = WaveSurfer.create({ container: '#waveform' });

        slider.oninput = function() {
            wavesurfer.setVolume(slider.value / 100);
        };
    </script>
</body>
</html>
