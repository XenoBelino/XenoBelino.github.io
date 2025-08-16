import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import os from 'os';
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

  // Busboy kräver råa headers
  const headers = event.headers;
  // Om Netlify event är Base64-kodat, måste vi dekoda det till buffer
  const buffer = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : Buffer.from(event.body, 'utf-8');

  // Wrapper för att parsa med Busboy
  function parseMultipart() {
    return new Promise((resolve, reject) => {
      const busboy = new Busboy({ headers });
      const fields = {};
      const files = [];

      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
      });

      busboy.on('file', (fieldname, fileStream, info) => {
        const { filename, mimeType } = info;
        const tmpFilePath = path.join(os.tmpdir(), filename);
        const writeStream = fs.createWriteStream(tmpFilePath);
        fileStream.pipe(writeStream);

        writeStream.on('close', () => {
          files.push({
            fieldname,
            filename,
            mimeType,
            filepath: tmpFilePath,
          });
        });

        writeStream.on('error', (err) => {
          reject(err);
        });
      });

      busboy.on('error', (err) => reject(err));

      busboy.on('finish', () => {
        resolve({ fields, files });
      });

      busboy.end(buffer);
    });
  }

  try {
    const { fields, files } = await parseMultipart();

    console.log("⚙️ Parsed form fields:", fields);
    console.log("📁 Parsed files:", files);

    if (!files.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Ingen fil hittades i förfrågan' }),
      };
    }

    const file = files[0];
    console.log(`📥 Mottagen fil: ${file.filename}, typ: ${file.mimeType}`);

    // Skicka filen vidare till HuggingFace API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.filepath), file.filename);

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
        ...formData.getHeaders(),
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
