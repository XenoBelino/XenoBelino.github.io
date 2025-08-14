import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  // Event body kommer base64-kodat (standard från Netlify)
  const buffer = Buffer.from(event.body, "base64");

  const form = new FormData();
  form.append("file", buffer, { filename: "upload.webm" });

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

    return {
      statusCode: 200,
      body: JSON.stringify({ data })
    };
  } catch (err) {
    console.error("Fel i function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Fel vid anrop till Hugging Face" })
    };
  }
}
