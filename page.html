<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Lato', sans-serif;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            height: 100vh;
            background-image: url('image.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            overflow-y: auto;
        }

        .video-container {
            width: 100%;
            height: 300px; /* Ändrat för att minska storleken på videospelaren */
            margin-bottom: 20px;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .editor-content {
            text-align: left;
            padding: 20px;
            width: 100%;
            flex: 1;
            background-color: transparent;
            border-radius: 10px;
        }

        .section-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 30px;
            width: 90%;
        }

        .section {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
        }

        .section-text {
            color: #6a0dad;
            font-size: 18px;
            flex: 1;
        }

        .volume-slider-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
        }

        .volume-slider {
            width: 200px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .volume-slider:hover {
            transform: scale(1.05);
        }

        .volume-percentage {
            font-size: 14px;
            color: #4F4A85;
        }

        .buttons-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
        }

        .button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            background-color: #6a0dad;
            color: white;
            transition: background-color 0.3s;
        }

        .button:hover {
            background-color: #5c0b8a;
        }

        /* Ny knapp för att gå tillbaka till hemsidan */
        .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            background-color: #6a0dad;
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .back-button:hover {
            background-color: #5c0b8a;
        }

    </style>
</head>
<body>

    <!-- Ny knapp för att gå tillbaka till hemsidan -->
    <button class="back-button" onclick="window.location.href = 'index.html'">Back to Homepage</button>

    <div class="editor-content">
        <div class="video-container">
            <video controls>
                <source src="video.mp4" type="video/mp4"> 
                Din webbläsare stödjer inte videospelaren.
            </video>
        </div>

        <div class="section-container">
            <div class="section">
                <div class="section-text">Your original File</div>
            </div>
            <div class="volume-slider-container">
                <span id="original-volume-icon" class="volume-icon">🔊</span>
                <div class="volume-percentage" id="original-volume-percent">40%</div>
                <input type="range" id="original-volume" class="volume-slider" min="0" max="100" value="40" oninput="updateVolumePercentage('original')">
            </div>
            <!-- Upprepa detta för andra sektioner om det behövs -->
        </div>
    </div>

    <div class="buttons-container">
        <button class="button" id="save-btn">Save</button>
        <button class="button" id="browse-btn">Browse my files</button>
    </div>

    <script>
        // Funktion för att uppdatera volymprocenten och ikonen vid sliderförändring
        function updateVolumePercentage(type) {
            const volumeSlider = document.getElementById(`${type}-volume`);
            const volume = volumeSlider.value;
            const volumePercentage = document.getElementById(`${type}-volume-percent`);
            const volumeIcon = document.getElementById(`${type}-volume-icon`);
            
            volumePercentage.textContent = `${volume}%`;

            // Uppdatera ikon baserat på volym
            if (volume == 0) {
                volumeIcon.textContent = '🔇';
            } else if (volume <= 30) {
                volumeIcon.textContent = '🔈';
            } else if (volume <= 70) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }

        // Funktion för att spara volyminställningar till en fil
        document.getElementById("save-btn").addEventListener("click", function() {
            const settings = {
                originalVolume: document.getElementById("original-volume").value,
                // Spara andra volyminställningar här om du har fler sliders
            };

            const fileContent = JSON.stringify(settings, null, 2);
            const blob = new Blob([fileContent], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "volume-settings.json";
            a.click();
        });

        // Funktion för att browse files
        document.getElementById("browse-btn").addEventListener("click", function() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "video/*, image/*";
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    alert("File selected: " + file.name);
                }
            };
            input.click();
        });

        // Funktion för att ändra bakgrund på homepage
        function changeBackground() {
            var choice = confirm("Do you want to change the background?");
            if (choice) {
                document.body.style.background = "linear-gradient(to right, #6a0dad, #f7b7d1)";
                document.body.style.backgroundSize = "cover";
            }
        }

    </script>
</body>
</html>
