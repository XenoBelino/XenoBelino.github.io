<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    
    <!-- Google Fonts - Lato (Utan preload för att undvika varning) -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    
    <script src="https://unpkg.com/wavesurfer.js"></script>

    <style>
        body {
            font-family: 'Lato', sans-serif;
            background-color: black;
            color: white;
            margin: 0;
            padding: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            max-width: 100%;
            box-sizing: border-box;
            flex: 1;
        }

        h1 {
            color: #4F4A85;
            margin-top: 0;
        }

        button {
            border-radius: 8px;
            padding: 10px 20px;
            background-color: #4F4A85;
            color: white;
            border: none;
            cursor: pointer;
            margin: 10px;
        }

        button:hover {
            background-color: #383351;
        }

        #waveform {
            width: 100%;
            height: 150px;
            background-color: #f0f0f0;
            margin-top: 20px;
        }

        video {
            margin-top: 20px;
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }

        #file-info {
            margin-top: 10px;
            color: #4F4A85;
        }

        #volume-slider {
            margin
