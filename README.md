<style>
    /* Grundläggande stil för hela sidan */
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4; /* Standard Light Mode bakgrundsfärg */
        margin: 0;
        padding: 0;
        transition: background-color 0.3s ease; /* Gör bakgrundsändringen smidig */
    }

    .editor-content {
        text-align: center;
        padding: 20px;
        max-width: 900px;
        margin: auto;
    }

    /* Stil för knappar */
    .button, .browse-button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        background-color: #6a0dad;
        color: white;
        transition: background-color 0.3s;
    }

    .button:hover, .browse-button:hover {
        background-color: #5c0b8a;
    }

    /* Volymreglage */
    .volume-slider-container {
        margin-top: 20px;
    }

    /* Stil för texten "No file selected" */
    #file-name {
        color: black;
        font-size: 18px;
    }

    /* Stil för bakgrunds- och navigeringsknappar */
    .back-button {
        position: fixed;
        top: 10px;
        left: 20px;
        padding: 10px 20px;
        background-color: #6a0dad;
        color: white;
        font-size: 18px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    }

    .back-button:hover {
        background-color: #5c0b8a;
    }

    /* Stil för Change Background-knappen */
    #change-background-btn {
        position: fixed;
        top: 10px;
        right: 10px; /* Flyttar knappen till övre högra hörnet */
        padding: 10px 20px;
        background-color: #6a0dad;
        color: white;
        font-size: 18px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1001; /* Säkerställer att den är över andra element */
    }

    #change-background-btn:hover {
        background-color: #5c0b8a;
    }

    /* Stil för Save Changes-knappen längst ner till höger */
    #save-btn {
        position: fixed;
        bottom: 10px;
        right: 20px; /* Justerat till nedre höger */
        padding: 10px 20px;
        background-color: #6a0dad;
        color: white;
        font-size: 18px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000; /* Säkerställer att den är över andra element */
    }

    #save-btn:hover {
        background-color: #5c0b8a;
    }

    /* Stil för videospelaren */
    .video-container {
        width: 60%; /* Justera bredden efter behov */
        max-width: 900px; /* Maxbredd för att förhindra att videospelaren blir för stor */
        height: auto;
        margin: 40px auto;
    }

    video {
        width: 100%;
        max-height: 50vh; /* Maxhöjd för videospelaren */
        object-fit: contain; /* Förhindrar att videon blir förvrängd */
        border-radius: 15px; /* Rundar kanterna på videospelaren */
    }

</style>
