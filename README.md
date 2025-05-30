<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Video Player with Settings</title>
    <style>
        /* Stilar för att centrera texten och knappen */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }

        .editor-content {
            text-align: center;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
        }

        h1 {
            font-size: 2.5em;
            color: #333;
            margin-bottom: 20px;
        }

        /* Knappdesign */
        .button {
            display: inline-block;
            padding: 15px 30px;
            font-size: 1.2em;
            color: white;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .button:hover {
            background-color: #0056b3;
        }

    </style>
</head>
<body>
    <div class="editor-content">
        <h1>This Page is undergoing construction!</h1>

        <!-- Navigeringslänkar -->
        <div>
            <!-- Gå till en annan sida (page.html) -->
            <a href="page.html" class="button">Go to Page</a>
        </div>
        
        <!-- Information about Visitor IP -->
        <div id="visitor-info">
            <p>Visitor IP Address: <span id="visitor-ip">Loading...</span></p>
        </div>

    </div>

    <script>
        // För att förhindra kopiering och högerklick
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'u')) {
                e.preventDefault(); // Förhindra kopiering och inspektering
            }
        });

        // Hämta användarens IP-adress med hjälp av ett API (exempelvis ipify)
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('visitor-ip').textContent = data.ip;  // Visar IP-adressen
            })
            .catch(error => {
                document.getElementById('visitor-ip').textContent = 'Unable to retrieve IP';
                console.error('Error fetching IP:', error);
            });

    </script>
</body>
</html>
