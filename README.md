<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XenoBelino Projekt</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="home">
    <div class="home-content">
        <h1>Welcome to Your Audio and Video Editor</h1>
        <p>Fix and edit your files with AI tools to separate audio tracks and make custom adjustments.</p>
        <button onclick="location.href='/pages/editor.html'">Get Started</button>

    </div>
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

    <script src="scripts.js"></script>
</body>
</html>
