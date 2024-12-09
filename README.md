<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css"> <!-- Länkar till din externa CSS-fil -->
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

        <div class="homepage">
            <h1>Welcome to My Website</h1>
            <p>This website allows you to edit files, save them, and interact with media content like audio and video. You can change the appearance by toggling between Light and Dark modes.</p>
            <a href="page.html" class="button">Go to Page</a>
        </div>
    </div>
</div>

<script src="scripts.js"></script> <!-- Länkar till din externa JavaScript-fil -->
</body>
</html>
