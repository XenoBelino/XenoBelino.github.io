import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fetch from "node-fetch";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

export default async function handler(req, res) {
  try {
    const { filename, filetype, data } = req.body;

    if (!filename || !filetype || !data) {
      return res.status(400).json({ error: "Saknar fildata" });
    }

    // Konvertera base64 till buffer
    const buffer = Buffer.from(data, "base64");

    const fileKey = `uploads/${Date.now()}-${filename}`;

    // Ladda upp filen till Cloudflare R2
    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: filetype,
    }));

    // Skapa filens publika URL för Hugging Face
    const fileUrl = `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileKey}`;

    // Skicka fil-URL till Hugging Face API
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/YOUR_MODEL", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: fileUrl }),
    });

    const hfResult = await hfResponse.json();

    // Radera filen från R2 efteråt
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    }));

    return res.status(200).json({ result: hfResult });
  } catch (error) {
    console.error("Fel i predict:", error);
    return res.status(500).json({ error: "Fel vid bearbetning" });
  }
}
