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

        .stars {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }

        .star {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: white;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            box-shadow: 0px 0px 2px white;
            transition: transform 1s ease, opacity 1s ease;
        }

        .falling-star {
            position: absolute;
            width: 40px;
            height: 2px;
            background: white;
            opacity: 0.5;
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

        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            color: white;
        }

        /* Styling för header och knappar */
        #change-background-btn {
            position: absolute;
            top: 20px;
            left: 20px;
            padding: 10px;
            background-color: #6a0dad;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10;
        }

        #change-background-btn:hover {
            background-color: #5c0b8a;
        }

        /* Layout för innehållet */
        .homepage {
            padding-top: 100px;
        }

        .button {
            padding: 10px 20px;
            margin: 20px;
            background-color: #6a0dad;
            color: white;
            font-size: 18px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
        }

        .button:hover {
            background-color: #5c0b8a;
        }
    </style>
</head>
<body>

<!-- Bakgrund -->
<div class="background" id="background">
    <!-- Stjärnor på bakgrund -->
    <div class="stars" id="stars"></div>

    <!-- Innehåll på sidan -->
    <div class="content">
        <button id="change-background-btn">Senge background</button>

        <div class="homepage">
            <h1>Welcome to My Website</h1>
            <p>This website allows you to edit files, save them, and interact with media content like audio and video. You can change the appearance by toggling between Light and Dark modes.</p>
            <!-- Länk till annan sida -->
            <a href="page.html" class="button">Go to Page</a>
        </div>
    </div>
</div>

<script>
    // Funktion för att skapa stjärnor på bakgrunden
    function createStars() {
        const starContainer = document.getElementById("stars");

        for (let i = 0; i < 100; i++) {
            let star = document.createElement("div");
            star.classList.add("star");
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 2 + 1}s`;
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
    let isDarkMode = false;

    function toggleBackground() {
        const background = document.getElementById("background");
        if (isDarkMode) {
            background.classList.remove("dark-background");
        } else {
            background.classList.add("dark-background");
        }
        isDarkMode = !isDarkMode;
    }

    // Klickhändelse för knappen "Senge background"
    document.getElementById("change-background-btn").addEventListener("click", () => {
        const lightModeOption = confirm("Choose Light Mode (OK) or Dark Mode (Cancel).");
        if (lightModeOption) {
            toggleBackground(); // byta till Light Mode
        } else {
            toggleBackground(); // byta till Dark Mode
        }
    });

    // Skapa stjärnorna när sidan laddas
    createStars();
</script>

</body>
</html>
