import { connectLambda, getStore } from '@netlify/blobs';

export async function handler(event, context) {
  connectLambda(event);

  const store = getStore('uploads'); // namnet på din blob store

  // event.request.formData() funkar i nya Netlify Runtime, annars kan du behöva annat sätt att parse FormData
  // Om inte det fungerar, kan du använda busboy eller liknande för att läsa upp filen från event.body

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
