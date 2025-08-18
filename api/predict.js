export default async function handler(req, res) {
  console.log("✅ Predict-funktionen körs!");
  console.log("HTTP Method:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body finns?", req.body ? "Ja" : "Nej");

  res.status(200).json({ message: "Funktionen fungerar!" });
}
