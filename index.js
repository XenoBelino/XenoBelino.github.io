import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import predictRoute from './api/predict.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname)); // visar t.ex. index.html om du vill

// Anslut /api/predict
app.use('/api/predict', predictRoute);

// Starta server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servern är igång på http://localhost:${PORT}`);
});
