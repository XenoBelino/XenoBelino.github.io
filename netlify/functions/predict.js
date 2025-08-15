import fetch from "node-fetch";
import FormData from "form-data";
import Busboy from "busboy";

export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  return new Promise((resolve, reject) => {
    const busboy = new Busboy({
      headers: {
        "content-type": event.headers["content-type"] || event.headers["Content-Type"]
      }
    });

    let fileBuffer = Buffer.alloc(0);

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      file.on("data", (data) => {
        fileBuffer = Buffer.concat([fileBuffer, data]);
      });
    });

    busboy.on("finish", async () => {
      const form = new FormData();
      form.append("file", fileBuffer, { filename: "upload.webm" });

      try {
        const hfRes = await fetch("https://YOUR-SPACE-NAME.hf.space/run/predict", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
            ...form.getHeaders()
          },
          body: form
        });

        const data = await hfRes.json();

        resolve({
          statusCode: 200,
          body: JSON.stringify({ data })
        });
      } catch (err) {
        console.error("Fel i HuggingFace-anrop:", err);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "Fel vid anrop till Hugging Face" })
        });
      }
    });

    busboy.end(Buffer.from(event.body, "base64"));
  });
};
