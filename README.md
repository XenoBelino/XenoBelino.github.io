<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - My Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Lato', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9; /* Light Mode standard bakgrund */
            color: #333;
        }

        .button {
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

        .button:hover {
            background-color: #5c0b8a;
        }

        .content {
            padding: 50px;
            text-align: center;
        }

    </style>
</head>
<body>

    <div class="content">
        <h1>Welcome to My Website</h1>
        <p>This website offers various features. Click below to explore.</p>
    </div>

    <!-- Change background button -->
    <button class="button" onclick="changeBackground()">Change Background</button>

    <script>
        // Variabel för att hålla reda på nuvarande bakgrundsläge (True = Dark Mode, False = Light Mode)
        let isDarkMode = false;

        function changeBackground() {
            if (isDarkMode) {
                // Om vi är i Dark Mode, fråga om vi ska växla till Light Mode
                var choice = confirm("Do you want to change to Light Mode?");
                if (choice) {
                    // Växla till Light Mode
                    document.body.style.background = "#f4f4f9"; // Light Mode bakgrund
                    isDarkMode = false; // Uppdatera tillståndet
                }
            } else {
                // Om vi är i Light Mode, fråga om vi ska växla till Dark Mode
                var choice = confirm("Do you want to change to Dark Mode?");
                if (choice) {
                    // Växla till Dark Mode
                    document.body.style.background = "linear-gradient(to right, #6a0dad, #f7b7d1)"; // Dark Mode bakgrund
                    isDarkMode = true; // Uppdatera tillståndet
                }
            }
        }
    </script>
</body>
</html>
