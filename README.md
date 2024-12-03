<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" crossorigin="anonymous">
    <script src="https://unpkg.com/wavesurfer.js"></script>

    <style>
        /* Grundläggande styling */
        body {
            font-family: 'Lato', sans-serif;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-image: linear-gradient(to right, #4F4A85, #ffffff, #4F4A85); /* Bakgrundsfärger */
            background-size: cover;
            overflow-y: auto;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            max-width: 100%;
            box-sizing: border-box;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start; /* Justera så att vi håller avståndet */
            align-items: center;
            padding-top: 10px;  /* Justera så att det ligger närmare */
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
            text-align: left;
            padding-left: 20px;
        }

        button {
            border-radius: 8px;
            padding: 8px 16px;
            background-color: #4F4A85;
            color: white;
            border: none;
            cursor: pointer;
            margin: 6px;
            font-size: 12px;
            transition: 0.3s;
            width: 120px;
        }

        button:hover {
            background-color: #383351;
        }

        /* Sektioner för ljud och video */
        .section {
            width: 100%;
            max-width: 600px;
            margin: 10px auto; /* Minska avståndet */
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Förstora texterna och justera deras avstånd */
        .section-text {
            color: #4F4A85;
            font-size: 16px; /* Större text */
            margin-right: 15px;
        }

        /* Placera volymreglagen närmare videospelaren */
        .volume-slider {
            width: 100px;  /* Större sliders */
            margin-left: 20px;
        }

        #waveform {
            width: 100%;
            height: 150px;
            background-color: transparent;  /* Ändra bakgrundsfärgen till transparent */
            margin-top: 20px;
            display: block;
        }

        video {
            margin-top: 10px;
            width: 250%;
            height: auto;
            border-radius: 8px;
            display: block;
            background-color: #000;
        }

        #file-info {
            margin-top: 10px;
            color: #4F4A85;
        }

        #volume-slider {
            margin-top: 20px;
            width: 100%;
            max-width: 500px;
        }

        /* Knapp för filuppladdning */
        .button-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            justify-content: space-evenly;
            width: 240px;
            z-index: 100;
        }

        #browse-button {
            width: 120px;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="editor-content">
        <h1>Edit Your Files</h1>  <!-- Rubrik ändrad -->

        <!-- Video player -->
        <video id="video-player" controls>
            <source id="video-source" type="video/mp4">
            Your browser does not support the video tag.
        </video>

        <!-- Audio waveforms -->
        <div id="waveform"></div>

        <!-- File Information -->
        <div id="file-info"></div>
    </div>

    <!-- Sektioner för filhantering och ljudjustering -->
    <div class="section">
        <div class="section-text">Your original file</div>
        <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50">
    </div>
    <div class="section
