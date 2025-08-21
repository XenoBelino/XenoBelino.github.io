import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/', async (req, res) => {
  const { fileName, someMetadata } = req.body;
  const apiKey = process.env.HUGGINGFACE_TOKEN;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/YOUR_MODEL", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, metadata: someMetadata })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fel vid fetch till Hugging Face:', error);
    res.status(500).json({ error: 'Fel vid hämtning av data från Hugging Face' });
  }
});

export default router;
