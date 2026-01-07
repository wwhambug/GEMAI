export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { messages } = await req.json();
  const apiKey = process.env.OPENROUTER_API_KEY; // Vercel 환경 변수 사용

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "model": "google/gemini-2.0-flash-exp:free",
          "messages": messages
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}