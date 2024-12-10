<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
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
    let modeButtonsVisible = false; // Flagga för att kontrollera synligheten
    document.getElementById("change-background-btn").addEventListener("click", () => {
        const modeButtons = document.getElementById("mode-buttons");
        if (modeButtonsVisible) {
            modeButtons.style.display = "none"; // Dölj knapparna om de är synliga
        } else {
            modeButtons.style.display = "flex"; // Visa knapparna
        }
        modeButtonsVisible = !modeButtonsVisible; // Växla synligheten
    });

    // När användaren klickar på "Light Mode"
    document.getElementById("light-mode-btn").addEventListener("click", () => {
        if (isDarkMode) {
            toggleBackground(); // Byt till Light Mode
        }
        document.getElementById("mode-buttons").style.display = "none"; // Dölj knapparna efter val
        modeButtonsVisible = false; // Återställ flaggan
    });

    // När användaren klickar på "Dark Mode"
    document.getElementById("dark-mode-btn").addEventListener("click", () => {
        if (!isDarkMode) {
            toggleBackground(); // Byt till Dark Mode
        }
        document.getElementById("mode-buttons").style.display = "none"; // Dölj knapparna efter val
        modeButtonsVisible = false; // Återställ flaggan
    });

    // Skapa stjärnorna när sidan laddas
    createStars();
</script>

</body>
</html>
