<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>

    <!-- Google Fonts - Lato -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" as="font" type="font/woff2" crossorigin="anonymous">
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
            justify-content: center;
            align-items: center;
            padding-top: 20px;
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
        .section-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            display: flex;
            flex-direction: column; /* Vertikal ordning */
            align-items: flex-start;
        }

        .section {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
        }

        .section-text {
            color: #4F4A85;
            margin-right: 15px;
            font-size: 18px;
            font-weight: bold;
            text-align: left;
            width: 200px;
        }

        .volume-slider-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end; /* Ljudkontroller till höger */
        }

        .volume-slider {
            width: 100px;
            margin-bottom: 5px;
        
