<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>XenoBelino</title>
  <link rel="stylesheet" href="/assets/css/style.css?v=12731462b1fb5b065e679ab19d135eb070f4df8f">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* Grundläggande stilar */
    body {
      font-family: 'Lato', sans-serif;
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100vh;
      background-color: lightblue;
      transition: background-color 0.5s, color 0.5s;
    }

    .editor-content {
      text-align: center;
      margin: 20px;
      z-index: 1;
      position: relative;
    }

    .button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 10px;
      border: none;
      background-color: #6a0dad;
      color: white;
      transition: background-color 0.3s;
    }

    .button:hover {
      background-color: #5c0b8a;
    }

    #file-info {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="editor-content">
    <h1>Welcome to my website</h1>
    <!-- File selector -->
    <button onclick="document.getElementById('file-input').click()" class="button">Browse my files</button>
    <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)" />
    <div id="file-info"></div>
  </div>

  <script>
    // Handle file selection
    function handleFileSelect(event) {
      const file = event.target.files[0];
      const fileInfoDiv = document.getElementById('file-info');
      const videoPlayer = document.getElementById('video-player');
      if (file) {
        fileInfoDiv.textContent = `Selected file: ${file.name}`;
        const fileURL = URL.createObjectURL(file);
        let extension = file.name.split('.').pop().toLowerCase();
        if (['mp3', 'wav', 'ogg'].includes(extension)) {
          videoPlayer.style.display = 'none'; // Hide video if it's an audio file
        } else if (['mp4', 'webm', 'mov'].includes(extension)) {
          videoPlayer.src = fileURL;
          videoPlayer.style.display = 'block'; // Show video if it's a video file
        }
      }
    }
  </script>
</body>
</html>
