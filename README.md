
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Editor</title>
    <link rel="preload" href="https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2" as="font" type="font/woff2" crossorigin="anonymous">

</head>
<body class="home"> <!-- Använd klassen home här -->
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

