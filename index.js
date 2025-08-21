const express = require('express');
const path = require('path');
const app = express();

// Middleware för att kunna läsa JSON
app.use(express.json());

// Statiska filer (för att visa t.ex. index.html om du vill köra allt via Render)
app.use(express.static(path.join(__dirname)));

// Importera och koppla din predict-route
const predictRoute = require('./api/predict');
app.use('/api/predict', predictRoute);

// Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servern är igång på port ${PORT}`);
});
