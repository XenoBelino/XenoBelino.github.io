<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Video Player with Settings</title>
  <link rel="stylesheet" href="styles.css"> <!-- Kontrollera att denna fil finns -->
</head>
<body>
  <div class="editor-content">
    <!-- Introduktion till sidan -->
    <div class="intro-section">
      <h1>Välkommen till Video- och Ljudredigeraren!</h1>
      <p>Här kan du ladda upp en video, ändra volyminställningar och justera bakgrunden.</p>
    </div>

    <!-- Video Player Container -->
    <div class="video-container">
      <video id="video-player" controls loop>
        <source src="assets/videos/sample.mp4" type="video/mp4">
        <!-- Kontrollera att filen finns -->
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Filval och info -->
    <button id="browse-btn" class="browse-button">Browse Files</button>
    <input type="file" id="file-input" style="display:none;" onchange="handleFileSelect(event)">
    <div id="file-name">No file selected</div>

    <!-- Knappar för bakgrundsändring och spara inställningar -->
    <button id="change-background-btn" class="button">Change Background</button>
    <div id="background-slider-container" style="display:none;">
      <input type="range" id="background-slider" min="0" max="1" step="1" value="0" oninput="changeBackgroundMode()">
      <label for="background-slider">0 = Light Mode, 1 = Dark Mode</label>
    </div>
    <button id="save-btn" class="button">Save Changes</button>

    <!-- Volymreglage -->
    <div class="volume-slider-container">
      <div>
        <label for="original-volume">Original Volume:</label>
        <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('original')">
        <span id="original-volume-percent" class="volume-percentage">50%</span>
        <span id="original-volume-icon">🔉</span>
      </div>
      <div>
        <label for="corrupted-volume">Corrupted Volume:</label>
        <input type="range" id="corrupted-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('corrupted')">
        <span id="corrupted-volume-percent" class="volume-percentage">50%</span>
        <span id="corrupted-volume-icon">🔉</span>
      </div>
      <div>
        <label for="music-volume">Music Volume:</label>
        <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('music')">
        <span id="music-volume-percent" class="volume-percentage">50%</span>
        <span id="music-volume-icon">🔉</span>
      </div>
      <div>
        <label for="final-volume">Final Volume:</label>
        <input type="range" id="final-volume" class="volume-slider" min="0" max="100" value="50" oninput="updateVolumePercentage('final')">
        <span id="final-volume-percent" class="volume-percentage">50%</span>
        <span id="final-volume-icon">🔉</span>
      </div>
    </div>

    <!-- Navigeringsknappar -->
    <button id="back-to-home-btn" class="button back-button">Go to Home Page</button>
  </div>

  <script src="scripts.js" defer></script> <!-- Kontrollera att denna fil finns -->
</body>
</html>
