// netlify/functions/predict.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const handler = async (event, context) => {
  console.log("🟡 Handler startad för /predict");
  console.log("📥 HTTP Method:", event.httpMethod);
  console.log("🔍 Event headers:", event.headers);
  console.log("🔍 typeof event.body:", typeof event.body);
  console.log("🔍 event.isBase64Encoded:", event.isBase64Encoded);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Endast POST tillåtet' }),
    };
  }

  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });

    // Workaround för Netlify + formidable
    if (event.isBase64Encoded) {
      event.body = Buffer.from(event.body, 'base64');
    }

    console.log("📤 Startar form.parse...");

    form.parse(event, async (err, fields, files) => {
      if (err) {
        console.error('❌ Fel vid form.parse:', err);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Fel vid uppladdning', details: err.message }),
        });
      }

      console.log("✅ form.parse klar.");
      console.log("📄 Fält:", fields);
      console.log("📂 Filer:", files);

      // Särskild debug: visa exakt vad som finns i `files`
      if (!files.file) {
        console.error('⚠️ Ingen "file" hittades i files-objektet:', JSON.stringify(files, null, 2));
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'Ingen fil skickades med' }),
        });
      }

      try {
        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
        console.log("📁 Uppladdad filväg:", uploadedFile.filepath);
        console.log("📏 Filstorlek:", uploadedFile.size);

        const formData = new FormData();
        formData.append('file', fs.createReadStream(uploadedFile.filepath));

        const hfToken = process.env.HUGGINGFACE_TOKEN;
        if (!hfToken) {
          console.error("❌ Saknad HUGGINGFACE_TOKEN!");
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Token saknas i miljövariabler' }),
          });
        }

        console.log("🚀 Skickar förfrågan till HuggingFace Space...");

        const response = await fetch('https://xenobelino-91837.hf.space/api/predict', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfToken}`,
          },
          body: formData,
        });

        const data = await response.json();
        console.log("✅ HuggingFace svar:", data);

        if (!response.ok) {
          console.error('⚠️ HuggingFace ERROR:', data);
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
        console.error('❌ Undantag under begäran:', err);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Internt serverfel', details: err.message }),
        });
      }
    });
  });
};
