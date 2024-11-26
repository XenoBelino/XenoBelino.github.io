<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link rel="stylesheet" href="styles.css"> <!-- Länk till CSS -->
</head>
<body class="editor">
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <!-- Browse Button -->
        <button onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)">
        
        <div id="file-info"></div>

        <!-- Save Button -->
        <button id="save-button" onclick="saveFile()">Save</button>
    </div>

    <script>
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfoDiv = document.getElementById('file-info');
            
            if (file) {
                fileInfoDiv.textContent = `Selected file: ${file.name}`;
                // Här kan du lägga till kod för att visualisera ljudfilen eller videon.
            }
        }

        function saveFile() {
            alert("Your changes have been saved!");
            // Här kan du lägga till kod för att spara filen eller ändra den.
        }
    </script>
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="editor">
    <div class="editor-content">
        <h1>Edit Your Files</h1>

        <!-- Browse Button -->
        <button onclick="document.getElementById('file-input').click()">Browse my files</button>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(event)">
        
        <div id="file-info"></div>

        <!-- Save Button -->
        <button id="save-button" onclick="saveFile()">Save</button>
    </div>

    <script>
        // JavaScript-kod här
        function handleFileSelect(event) {
            const file = event.target.files[0];
            const fileInfoDiv = document.getElementById('file-info');
            
            if (file) {
                fileInfoDiv.textContent = `Selected file: ${file.name}`;
                // Här kan du lägga till kod för att visualisera ljudfilen eller videon.
            }
        }

        function saveFile() {
            alert("Your changes have been saved!");
            // Här kan du lägga till kod för att spara filen eller ändra den.
        }
    </script>
</body>
</html>
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileInfoDiv = document.getElementById("file-info");
    
    if (file) {
        fileInfoDiv.textContent = "Selected file: ${file.name}";
        // Här kan du lägga till kod för att visualisera ljudfilen eller videon.
    }
}

function saveFile() {
    alert("Your changes have been saved!");
    // Här kan du lägga till kod för att spara filen eller ändra den.
}
/* Bakgrundsfärger och text */
body.editor {
    background-color: #121212; /* Mörk bakgrundsfärg */
    color: white; /* Texten ska vara vit */
    text-align: center; /* Centrerar text */
    font-family: Arial, sans-serif; /* Typsnitt */
    height: 100vh; /* Full höjd på sidan */
    display: flex; /* Flexbox layout */
    flex-direction: column; /* Vertikal ordning */
    justify-content: center; /* Centrerar innehållet vertikalt */
}

/* Bakgrundsbild på startsidan */
body.home {
    background-color: black;
    color: white;
    text-align: center;
    background-image: url('music-notes-animation.gif'); /* Bakgrundsbild */
    background-size: cover;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Stil på rubriken */
h1 {
    font-size: 36px;
    color: #FF6347; /* Tomatröd färg för rubriken */
}

/* Knappar */
button {
    background-color: #4CAF50; /* Grön bakgrund för knappar */
    color: white; /* Vit text på knappar */
    padding: 15px 30px;
    border: none;
    cursor: pointer;
    font-size: 18px;
    margin: 10px;
    border-radius: 5px; /* Rundade hörn */
    transition: background-color 0.3s ease; /* Lägger till en smidig övergång */
}

button:hover {
    background-color: #45a049; /* Mörkare grön vid hover */
}

/* Filinfo */
#file-info {
    margin-top: 20px;
    font-size: 18px;
    color: #FFD700; /* Guldtext för filinformation */
    background-color: rgba(0, 0, 0, 0.7); /* Svart bakgrund med transparens */
    padding: 10px;
    border-radius: 5px;
}

/* Korrekt formatering av text */
h1, p {
    margin: 0;
    padding: 10px;
}
