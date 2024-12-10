<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css"> <!-- Länka till CSS-filen -->
</head>
<body>

    <div class="container-lg">
        <button id="change-background-btn">Change Background</button>
        <h1>Welcome to My Website</h1>
        <p>This website allows you to edit files, save them, and interact with media content like audio and video. You can change the appearance by toggling between Light and Dark modes.</p>
        
        <!-- Light/Dark Mode toggle -->
        <button id="light-dark-toggle">Dark Mode</button>

        <!-- Placeholder för stjärnor -->
        <div id="stars"></div> <!-- Behållare för stjärnorna -->

        <button id="go-to-page">Go to Page</button>
    </div>

    <script src="script.js"></script> <!-- Länka till JavaScript -->
</body>
</html>
