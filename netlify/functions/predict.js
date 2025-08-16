// netlify/functions/predict.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const handler = async (event, context) => {
  // Logga för felsökning
  console.log("🔍 Event body type:", typeof event.body);
  console.log("📦 Raw event.body:", event.body);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Endast POST tillåtet' }),
    };
  }

  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });

    form.parse(event, async (err, fields, files) => {
      if (err) {
        console.error('❌ Fel vid uppladdning:', err);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Fel vid uppladdning', details: err.message }),
        });
      }

      // Kontrollera att fil verkligen finns
      if (!files.file) {
        console.error('⚠️ Ingen fil hittades i "files":', files);
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'Ingen fil skickades med' }),
        });
      }

      try {
        const uploadedFilePath = files.file[0].filepath;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(uploadedFilePath));

        const hfToken = process.env.HUGGINGFACE_TOKEN;
        if (!hfToken) {
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Token saknas i miljövariabler' }),
          });
        }

        const response = await fetch('https://xenobelino-91837.hf.space/api/predict', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfToken}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('⚠️ HuggingFace-fel:', data);
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Fel från Hugging Face', details: data }),
          });
        }

        return resolve({
          statusCode: 200,
          body: JSON.stringify({ data }),
        });
      } catch (err) {
        console.error('❌ Undantag kastat:', err);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Internt serverfel', details: err.message }),
        });
      }
    });
  });
};
