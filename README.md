<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">

    <!-- Ladda Wavesurfer.js -->
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

        /* Förstorade stjärnor som primo gems form */
        .star-fall {
            position: absolute;
            width: 30px;
            height: 30px;
            background-color: lightblue; /* Ljusblå färg för stjärnor */
            opacity: 0.8;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); /* Form av primo gems */
            animation: none; /* Stjärnorna ska inte röra sig */
            z-index: -1;
        }

        /* Förstorade stjärnfall - snedstreck som representerar stjärnfall */
        .falling-star {
            position: absolute;
            width: 4px;
            height: 40px;
            background-color: white; /* Vit färg för snedstreck */
            opacity: 0.8;
            transform: rotate(-45deg); /* Skapa snedstreck */
            animation: fall 1s ease-in-out infinite;
            z-index: -1;
        }

        /* Animering för stjärnfall */
        @keyframes fall {
            0% {
                transform: translateY(0) rotate(-45deg);
            }
            100% {
                transform: translateY(100vh) rotate(-45deg); /* Rör sig från toppen till botten */
            }
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
        <button onclick="setLightMode()">Light Mode</button>
        <button onclick="setDarkMode()">Dark Mode</button>
    </div>

    <!-- Moln och stjärnor -->
    <div class="clouds"></div>
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
            generateStars('#e0b3e6', '#f1c6e7');
            hideBackgroundOptions();
        }

        // Dark Mode bakgrund
        function setDarkMode() {
            document.body.className = 'dark-mode';
            generateStars('#333', '#6a4c9c');
            hideBackgroundOptions();
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

            for (let i = 0; i < starCount; i++) {
                let star = document.createElement('div');
                star.classList.add('star-fall');
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
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

                // Om filen är en ljudfil
                let extension = file.name.split('.').pop().toLowerCase();
                if (['mp3', 'wav', 'ogg'].includes(extension)) {
                    // Hantera ljudfil med Wavesurfer
                    wavesurfer.load(fileURL);
                } else if (['mp4', 'webm', 'avi'].includes(extension)) {
                    // Om det är en videofil, sätt den som källa för videoelementet
                    videoPlayer.src
