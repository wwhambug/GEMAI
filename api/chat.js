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
        // 무료 티어 중 현재 가장 안정적인 모델로 변경
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": messages,
        "temperature": 0.7
      })
    });

    const data = await response.json();
    
    // OpenRouter에서 에러를 보낸 경우 처리
    if (data.error) {
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "Server communication error" });
  }
}