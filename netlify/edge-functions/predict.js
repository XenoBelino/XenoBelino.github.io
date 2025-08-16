export const config = {
  path: "/predict",
};

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Endast POST tillåtet" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      console.error("❌ Ingen fil mottagen");
      return new Response(JSON.stringify({ error: "Ingen fil skickades med" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newForm = new FormData();
    newForm.append("file", file); // ✅ OBS: använd append, inte set

    const hfToken = import.meta.env.HUGGINGFACE_TOKEN;
    if (!hfToken) {
      console.error("❌ Token saknas i miljövariabler");
      return new Response(JSON.stringify({ error: "Token saknas" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hfRes = await fetch("https://xenobelino-91837.hf.space/api/predict", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
      },
      body: newForm,
    });

    const data = await hfRes.json();

    if (!hfRes.ok) {
      console.error("❌ Fel från Hugging Face:", data);
      return new Response(JSON.stringify({ error: "Fel från Hugging Face", details: data }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ Hugging Face response:", data);

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Undantag kastat i Edge Function:", err);
    return new Response(JSON.stringify({ error: "Internt serverfel", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
