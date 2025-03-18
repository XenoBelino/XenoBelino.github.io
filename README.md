<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <style>
        /* Din CSS här */
    </style>
</head>
<body>
    <div class="editor-content">
        <h1>Välkommen till Video- och Ljudredigeraren!</h1>
        <p>Här kan du ladda upp en video, ändra volyminställningar och justera bakgrunden.</p>

        <!-- Lägg till navigeringslänkar här -->
        <div>
            <!-- Gå till startsidan -->
            <a href="index.html" class="button">Go to Homepage</a>
            <!-- Gå till en annan sida (page.html) -->
            <a href="page.html" class="button">Go to Page</a>
        </div>

        <!-- Video Player Container -->
        <div class="video-container">
            <video id="video-player" controls>
                <source id="video-source" src="assets/videos/sample.mp4" type="video/mp4">
                <source src="assets/videos/sample.webm" type="video/webm">
                <source src="assets/videos/sample.ogv" type="video/ogg">
                <source src="assets/videos/sample.mkv" type="video/mkv">
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- Din övriga kod här -->
    </div>
</body>
</html>
