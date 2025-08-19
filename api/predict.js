export default async function handler(req, res) {
  const { fileName, someMetadata } = req.body;
  const apiKey = process.env.HUGGINGFACE_TOKEN;

  // Hämta analys från Hugging Face (eller annan tjänst)
  const response = await fetch("https://api-inference.huggingface.co/models/YOUR_MODEL", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName, metadata: someMetadata })
  });
  const data = await response.json();
  res.status(200).json(data);
}
