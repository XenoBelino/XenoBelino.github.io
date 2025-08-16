export const config = {
  path: "/predict",
};

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Endast POST tillåtet", { status: 405 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file) {
    return new Response("Ingen fil skickades med", { status: 400 });
  }

  try {
    const hfRes = await fetch("https://xenobelino-91837.hf.space/api/predict", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`
      },
      body: file
    });

    const data = await hfRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Fel vid Hugging Face API", { status: 500 });
  }
};
