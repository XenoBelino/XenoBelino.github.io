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
    </script>
</body>
</html>

}
body.home {
    background-color: black;
    color: white;
    text-align: center;
    background-image: url("music-notes-animation.gif");
    background-size: cover;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

body.editor {
    background-color: black;
    color: white;
    text-align: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

button {
    background-color: #007bff;
    color: white;
    padding: 15px 30px;
    border: none;
    cursor: pointer;
    font-size: 18px;
    margin: 10px;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}

#file-info {
    margin-top: 20px;
    font-size: 18px;
}
