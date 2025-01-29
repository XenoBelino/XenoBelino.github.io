    <p>&lt;!DOCTYPE html&gt;</p>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
            position: fixed;
            top: 10px; /* Fixerad position uppe till höger */
            right: 10px;
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

        /* För att skapa stjärnor */
        .star {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: white;
            border-radius: 50%;
            opacity: 0.8;
        }

        .falling-star {
            position: absolute;
            width: 3px;
            height: 20px;
            background-color: white;
            transform: rotate(-45deg);
            animation: fall 3s ease-in-out infinite;
        }

        @keyframes fall {
            0% {
                transform: translateY(-100px) rotate(-45deg);
            }
            100% {
                transform: translateY(100vh) translateX(100px) rotate(-45deg);
            }
        }

    </style>
</head>
<body class="light-mode">
    <!-- Dynamiska stjärnor och stjärnfall -->
    <div class="falling-star" style="top: 20px; left: 20px;"></div>
    <div class="falling-star" style="top: 100px; left: 50px;"></div>
    <div class="falling-star" style="top: 300px; left: 200px;"></div>
    <div class="star" style="top: 50px; left: 100px;"></div>
    <div class="star" style="top: 200px; left: 300px;"></div>

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
        // Funktion som hanterar knappens funktionalitet
        function toggleBackgroundOptions() {
            var options = document.getElementById('background-options');
            if (options.style.display === 'block') {
                options.style.display = 'none';
            } else {
                options.style.display = 'block';
                updateBackgroundOptionsPosition(); // Uppdatera positionen för slidern
            }
        }

        // Sätt Light Mode
        function setLightMode() {
            document.body.className = 'light-mode';
            hideBackgroundOptions();
        }

        // Sätt Dark Mode
        function setDarkMode() {
            document.body.className = 'dark-mode';
            hideBackgroundOptions();
        }

        // Döljer bakgrundsoptionerna när ett val görs
        function hideBackgroundOptions() {
            document.getElementById('background-options').style.display = 'none';
        }

        // Uppdatera positionen för bakgrundsoptionssliden baserat på knappen
        function updateBackgroundOptionsPosition() {
            var btn = document.getElementById('change-background-btn');
            var options = document.getElementById('background-options');
            var btnRect = btn.getBoundingClientRect(); // Hämta knappens position

            // Placera slidern exakt under knappen
            options.style.top = (btnRect.bottom + window.scrollY) + 'px';  // Korrigera vertikal position för scroll
            options.style.left = btnRect.left + 'px';  // Placera exakt under knappen
        }

        // Funktion som hanterar filval
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

        // Dynamiska stjärnor
        for (let i = 0; i < 50; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;
            document.body.appendChild(star);
        }

        // Dynamiska stjärnfall
        for (let i = 0; i < 5; i++) {
            let fallingStar = document.createElement('div');
            fallingStar.classList.add('falling-star');
            fallingStar.style.top = `${Math.random() * 100}vh`;
            fallingStar.style.left = `${Math.random() * 100}vw`;
            document.body.appendChild(fallingStar);
        }
    </script>
</body>
</html>


      
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js" integrity="sha256-lZaRhKri35AyJSypXXs4o6OPFTbTmUoltBbDCbdzegg=" crossorigin="anonymous"></script>
    <script>anchors.add();</script>
  </body>
</html>
