<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Grundläggande styling */
        body {
            font-family: 'Lato', sans-serif;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
        }

        /* Bakgrund för sidan */
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #a85ec7, #f0a8d8);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            transition: background 1s ease;
        }

        .dark-background {
            background: linear-gradient(135deg, #000000, #6a0dad);
        }

        /* Styling för knappar */
        #change-background-btn, .mode-btn, #go-to-page-btn {
            padding: 10px 20px;
            margin: 10px;
            background-color: #6a0dad;
            color: white;
            font-size: 16px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
        }

        #change-background-btn:hover, .mode-btn:hover, #go-to-page-btn:hover {
            background-color: #5c0b8a;
        }

        /* Huvudinnehåll */
        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            color: white;
        }

        /* Flytta Change Background knappen till högre upp till vänster */
        #change-background-btn {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
        }

        /* Visa knappar för Light Mode och Dark Mode under varandra */
        #mode-buttons {
            display: none;
            flex-direction: column;
            align-items: center;
            margin-top: 10px;
        }

        /* Styling för Go to Page knappen */
        #go-to-page-btn {
            margin-top: 20px;
            background-color: #383351;
        }

        /* Stjärnor och gnistor */
        .stars {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            z-index: -1;
        }

        .star {
            position: absolute;
            width: 15px;
            height: 15px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.8);
            animation: sparkle 1.5s infinite alternate;
        }

        @keyframes sparkle {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }

        .falling-star {
            position: absolute;
            width: 20px;
            height: 2px;
            background: white;
            opacity: 0.8;
            transform: rotate(45deg);
            animation: fall 2s infinite;
        }

        /* Animation för stjärnfall */
        @keyframes fall {
            0% {
                transform: translate(0, 0) rotate(45deg);
                opacity: 1;
            }
            100% {
                transform: translate(300px, 400px) rotate(45deg);
                opacity: 0;
            }
        }

        /* För att säkerställa att Go to Page-knappen visas överst */
        #go-to-page-btn {
            position: relative;
            z-index: 2;
        }

    </style>
</head>
<body>

<!-- Bakgrund -->
<div class="background" id="background">
    <!-- Stjärnor på bakgrunden -->
    <div class="stars" id="stars"></div>

    <!-- Innehåll på sidan -->
    <div class="content">
        <!-- Knapp för att ändra bakgrund -->
        <button id="change-background-btn">Change Background</button>

        <!-- Knappar för Dark Mode och Light Mode -->
        <div id="mode-buttons">
            <button class="mode-btn" id="dark-mode-btn">Dark Mode</button>
            <button class="mode-btn" id="light-mode-btn">Light Mode</button>
        </div>

        <div class="homepage">
            <h1>Welcome to My Website</h1>
            <p>This website allows you to edit files, save them, and interact with media content like audio and video. You can change the appearance by toggling between Light and Dark modes.</p>
            <!-- Länk till annan sida -->
            <a href="page.html" id="go-to-page-btn" class="mode-btn">Go to Page</a>
        </div>
    </div>
</div>

<script>
    // För att hålla reda på bakgrundsläget
    let isDarkMode = false;

    // Funktion för att växla bakgrundsläge
    function toggleBackground() {
        const background = document.getElementById("background");
        if (isDarkMode) {
            background.classList.remove("dark-background");
        } else {
            background.classList.add("dark-background");
        }
        isDarkMode = !isDarkMode;
    }

    // Funktion för att skapa stjärnorna
    function createStars() {
        const starContainer = document.getElementById("stars");

        // Skapa en mängd stjärnor
        for (let i = 0; i < 100; i++) {
            let star = document.createElement("div");
            star.classList.add("star");
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            starContainer.appendChild(star);
        }

        // Stjärnfallseffekt
        for (let i = 0; i < 5; i++) {
            let fallingStar = document.createElement("div");
            fallingStar.classList.add("falling-star");
            fallingStar.style.top = `${Math.random() * 100}%`;
            fallingStar.style.left = `${Math.random() * 100}%`;
            starContainer.appendChild(fallingStar);
        }
    }

    // Växla mellan Light Mode och Dark Mode
    document.getElementById("change-background-btn").addEventListener("click", () => {
        const modeButtons = document.getElementById("mode-buttons");
        modeButtons.style.display = "flex"; // Visa knapparna vertikalt

        // När användaren klickar på "Light Mode"
        document.getElementById("light-mode-btn").addEventListener("click", () => {
            if (isDarkMode) {
                toggleBackground(); // Byt till Light Mode
            }
            modeButtons.style.display = "none"; // Dölj knapparna efter val
        });

        // När användaren klickar på "Dark Mode"
        document.getElementById("dark-mode-btn").addEventListener("click", () => {
            if (!isDarkMode) {
                toggleBackground(); // Byt till Dark Mode
            }
            modeButtons.style.display = "none"; // Dölj knapparna efter val
        });
    });

    // Skapa stjärnorna när sidan laddas
    createStars();
</script>

</body>
</html>
