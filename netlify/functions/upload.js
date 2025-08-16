import { connectLambda, getStore } from '@netlify/blobs';

export async function handler(event, context) {
  console.log("⏱ Upload function triggered"); // ✅ Detta loggar att funktionen ens körs

  connectLambda(event);
  const store = getStore('uploads'); // namnet på din blob store

  // Försök hämta FormData från requesten
  const formData = await event.request.formData();
  const file = formData.get('file');

  if (!file) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Ingen fil skickades med." }),
    };
  }

  const key = `video-${Date.now()}`;
  await store.set(key, file);

  return {
    statusCode: 200,
    body: JSON.stringify({ key }),
  };
}
