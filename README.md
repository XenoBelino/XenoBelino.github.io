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

        /* Knapp för Change Background */
        #change-background-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            padding: 10px 20px;
        }

        /* Knapparna för bakgrundsval, initialt dolda */
        .background-options {
            display: none;
            position: absolute;
            top: 50px; /* Justera vertikalt för att placera dem under knappen */
            right: 10px;
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

        /* Anpassad bakgrundsfärg för Light Mode och Dark Mode knappar */
        .light-mode-btn {
            background-color: #f1c6e7; /* Rosa */
        }

        .dark-mode-btn {
            background-color: #6a4c9c; /* Ljuslila */
        }

        /* För att skapa stjärnor */
        .star {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: white;
            border-radius: 50%;
            opacity: 0.8;
            animation: none;
        }

        /* Stjärnfall animation som rör sig diagonalt */
        @keyframes staggeredFall {
            0% {
                transform: translateY(-100px) translateX(-50px);
            }
            100% {
                transform: translateY(100vh) translateX(50px);
            }
        }

    </style>
</head>
<body class="light-mode">
    <!-- Dynamiska stjärnor -->
    <div class="star" style="top: 20px; left: 20px; animation: staggeredFall 3s linear infinite;"></div>
    <div class="star" style="top: 100px; left: 50px; animation: staggeredFall 3s linear infinite;"></div>
    <div class="star" style="top: 200px; left: 150px; animation: staggeredFall 3s linear infinite;"></div>
    <div class="star" style="top: 300px; left: 200px; animation: staggeredFall 3s linear infinite;"></div>
    <div class="star" style="top: 400px; left: 250px; animation: staggeredFall 3s linear infinite;"></div>

    <div class="editor-content">
        <h1>Welcome to my website</h1>

        <!-- Knappar i en container för att undvika överlappning -->
        <div class="button-container">
            <button onclick="document.getElementById('file-input').click()">Browse my files</button>
            <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)" />
            
            <button id="go-to-page-btn" onclick="window.location.href='page.html'">Go to Page</button>

            <button id="change-background-btn" onclick="toggleBackgroundOptions()">Change Background</button>
        </div>

        <!-- Knappar för bakgrundsval (Light Mode, Dark Mode) -->
        <div id="background-options" class="background-options">
            <button class="light-mode-btn" onclick="setLightMode()">Light Mode</button>
            <button class="dark-mode-btn" onclick="setDarkMode()">Dark Mode</button>
        </div>
    </div>

    <script>
        // Toggle visibility of the background options (Light and Dark Mode buttons)
        function toggleBackgroundOptions() {
            var options = document.getElementById('background-options');
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
            positionBackgroundOptions(); // Justera positionen om nödvändigt
        }

        // Ställer in Light Mode
        function setLightMode() {
            document.body.className = 'light-mode';
            hideBackgroundOptions();
        }

        // Ställer in Dark Mode
        function setDarkMode() {
            document.body.className = 'dark-mode';
            hideBackgroundOptions();
        }

        // Döljer bakgrundsoptions när ett val görs
        function hideBackgroundOptions() {
            document.getElementById('background-options').style.display = 'none';
        }

        // Placera bakgrundsoptions precis under knappen
        function positionBackgroundOptions() {
            var btn = document.getElementById('change-background-btn');
            var options = document.getElementById('background-options');
            var btnRect = btn.getBoundingClientRect();

            // Placera knapparna precis under Change Background-knappen
            options.style.top = (btnRect.bottom + window.scrollY) + 'px'; // Använd scrollY för att beakta eventuella sidrullning
            options.style.left = btnRect.left + 'px';
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
                    // Lägg till ljudspelare här
                } else if (['mp4', 'webm', 'mov'].includes(extension)) {
                    videoPlayer.src = fileURL;
                    videoPlayer.style.display = 'block';
                }
            }
        }

        // Skapa dynamiska stjärnor på skärmen
        for (let i = 0; i < 50; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;

            // Fördela animationstider slumpmässigt för att skapa en spridningseffekt
            const delay = Math.random() * 5;  // Fördröjning på 0-5 sekunder
            star.style.animation = `staggeredFall ${3 + Math.random() * 3}s linear infinite`;
            star.style.animationDelay = `-${delay}s`; // Fördröj animationen för varje stjärna
            document.body.appendChild(star);
        }
    </script>
</body>
</html>
