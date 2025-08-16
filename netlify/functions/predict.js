// netlify/functions/predict.js
import parser from 'lambda-multipart-parser';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const handler = async (event, context) => {
  console.log("🚀 predict.js startar");
  console.log("HTTP Method:", event.httpMethod);
  console.log("Headers:", event.headers);
  console.log("Body finns?", event.body ? "Ja" : "Nej");
  console.log("Is Base64 Encoded?", event.isBase64Encoded);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Endast POST tillåtet' }),
    };
  }

  try {
    // Parsar multipart/form-data
    const result = await parser.parse(event);

    console.log("⚙️ Parsed form fields:", result.fields);
    console.log("📁 Parsed files:", result.files);

    if (!result.files || result.files.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Ingen fil hittades i förfrågan' }),
      };
    }

    const file = result.files[0];
    console.log(`📥 Mottagen fil: ${file.filename}, typ: ${file.contentType}, storlek: ${file.content.length} bytes`);

    // Skapa en temporär fil (valfritt, för debugging / vidare användning)
    const tempFilePath = `/tmp/${file.filename}`;
    fs.writeFileSync(tempFilePath, file.content);
    console.log(`💾 Fil sparad temporärt på: ${tempFilePath}`);

    // Förbered form-data att skicka till HuggingFace API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(tempFilePath));

    const hfToken = process.env.HUGGINGFACE_TOKEN;
    if (!hfToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Token saknas i miljövariabler' }),
      };
    }

    console.log("⏳ Skickar fil till HuggingFace API...");

    const response = await fetch('https://xenobelino-91837.hf.space/api/predict', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hfToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❗ Fel från HuggingFace API:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Fel från HuggingFace API', details: data }),
      };
    }

    console.log("✅ HuggingFace svar mottaget:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };

  } catch (error) {
    console.error('❌ Fel i predict-funktionen:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internt serverfel', details: error.message }),
    };
  }
};
