import { IncomingForm } from "formidable";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

// Inaktivera default body-parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Endast POST tillåtet" });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Fel vid tolkning av formulär:", err);
      return res.status(400).json({ error: "Fel vid tolkning av formulär" });
    }

    const file = files.file;
    if (!file) {
      console.error("❌ Ingen fil mottagen");
      return res.status(400).json({ error: "Ingen fil skickades med" });
    }

    try {
      const fileStream = fs.createReadStream(file.filepath);

      const formData = new FormData();
      formData.append("file", fileStream, file.originalFilename);

      const hfToken = process.env.HUGGINGFACE_TOKEN;
      if (!hfToken) {
        console.error("❌ Token saknas i miljövariabler");
        return res.status(500).json({ error: "Token saknas" });
      }

      const hfRes = await fetch("https://xenobelino-91837.hf.space/api/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
        },
        body: formData,
      });

      const data = await hfRes.json();

      if (!hfRes.ok) {
        console.error("❌ Fel från Hugging Face:", data);
        return res.status(500).json({ error: "Fel från Hugging Face", details: data });
      }

      console.log("✅ Hugging Face response:", data);
      return res.status(200).json({ data });
    } catch (e) {
      console.error("❌ Undantag kastat:", e);
      return res.status(500).json({ error: "Internt serverfel", details: e.message });
    }
  });
};
