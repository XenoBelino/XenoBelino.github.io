body {
    font-family: 'Lato', sans-serif;
    color: white;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Gör så att innehållet börjar från vänster */
    align-items: flex-start; /* Justera till vänster */
    height: 100vh;
    background-image: url('path/to/your/image.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    overflow-y: auto;
    padding-left: 10px; /* Justerat för att ge mer utrymme från vänsterkanten */
}

.editor-content {
    text-align: left; /* Säkerställ att texten är vänsterjusterad */
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
    width: 90%; /* Justera för att passa bättre på sidan */
}

.section {
    display: flex;
    flex-direction: row;
    justify-content: flex-start; /* Se till att innehållet är vänsterjusterat */
    align-items: center;
    width: 100%;
}

.section-text {
    color: #6a0dad;
    font-size: 18px;
    flex: 1;
    margin-left: 10px;
}

.volume-slider-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-left: 0; /* Fjärrar alla extra mellanrum */
}

.volume-icon {
    font-size: 30px;
    cursor: pointer;
    margin-left: 0; /* Fjärrar extra mellanrum till vänster om ikonen */
}

.volume-slider {
    width: 200px; /* Justera bredden för bättre visning */
    margin-bottom: 5px;
    cursor: pointer;
}

.volume-percentage {
    font-size: 14px;
    color: #4F4A85;
}

.volume-slider-container:hover {
    transform: scale(1.05);
}
