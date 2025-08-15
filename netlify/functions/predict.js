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

  console.log("📥 → Request headers:", event.headers);
  console.log("📏 → BODY LENGTH (base64):", event.body.length);

  return new Promise((resolve, reject) => {
    const busboy = new Busboy({
      headers: {
        "content-type": event.headers["content-type"] || event.headers["Content-Type"]
      }
    });

    let fileBuffer = Buffer.alloc(0);
    let fileInfo = { filename: "", mimetype: "" };

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      fileInfo = { filename, mimetype };
      console.log(`📄 Mottagen fil – namn: ${filename}, typ: ${mimetype}`);

      file.on("data", (data) => {
        fileBuffer = Buffer.concat([fileBuffer, data]);
      });
    });

    busboy.on("finish", async () => {
      console.log("📦 Filstorlek (bytes):", fileBuffer.length);

      const form = new FormData();
      form.append("file", fileBuffer, { filename: fileInfo.filename || "upload.webm" });

      try {
        const hfRes = await fetch("https://XenoBelino-91837.hf.space/run/predict", {
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
        console.error("❌ Fel i HuggingFace-anrop:", err);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "Fel vid anrop till Hugging Face" })
        });
      }
    });

    // Viktigt: kör busboy på inkommande body
   const rawBody = Buffer.from(event.body, "base64");
   busboy.end(rawBody);
  });
};
