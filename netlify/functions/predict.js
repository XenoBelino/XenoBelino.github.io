export const handler = async (event) => {
  console.log("✅ Predict-funktionen körs!");
  console.log("HTTP Method:", event.httpMethod);
  console.log("Headers:", event.headers);
  console.log("Body finns?", event.body ? "Ja" : "Nej");

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Funktionen fungerar!" }),
  };
};
