// netlify/functions/huggingface-proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const HF_API_URL = 'https://api-inference.huggingface.co/models/XenoBelino/91837';
  const HF_API_TOKEN = process.env.HF_API_TOKEN; // Lägg din token i Netlify miljövariabler!

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: event.body
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
