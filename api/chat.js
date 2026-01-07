export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API Key is missing in Vercel settings.' });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gemai.vercel.app", // 본인 도메인으로 변경 권장
        "X-Title": "GEMAI Prototype"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-exp:free", // 가장 빠르고 안정적인 무료 모델
        "messages": messages,
        "temperature": 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter Error:', data.error);
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "Server communication error: " + error.message });
  }
}