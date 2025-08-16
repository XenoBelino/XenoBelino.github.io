import fetch from 'node-fetch';
import formidable from 'formidable';
import { Readable } from 'stream';

export const config = {
  bodyParser: false,
};

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Endast POST tillåtet' };
  }

  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(event, async (err, fields, files) => {
      if (err) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Kunde inte läsa filen' }),
        });
      }

      const file = files.file;

      if (!file) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'Ingen fil hittades' }),
        });
      }

      const stream = Readable.from(file._readStream);

      const formData = new FormData();
      formData.append('file', stream, file.originalFilename);

      try {
        const hfRes = await fetch("https://xenobelino-91837.hf.space/api/predict", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
          },
          body: formData,
        });

        const result = await hfRes.json();

        resolve({
          statusCode: 200,
          body: JSON.stringify(result),
        });
      } catch (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: err.message }),
        });
      }
    });
  });
}
