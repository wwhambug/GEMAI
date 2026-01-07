export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gemai.vercel.app", 
        "X-Title": "GEMAI"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct",
        "messages": messages
      })
    });

    const data = await response.json();
    if (data.error) return res.status(data.error.code || 500).json({ error: data.error.message });
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "서버 통신 오류" });
  }
}