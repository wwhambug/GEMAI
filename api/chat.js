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
        "HTTP-Referer": "https://gamai.wwhambug.kro.kr", 
        "X-Title": "GEMAI"
      },
      body: JSON.stringify({
        // 현재 가장 원활하게 작동하는 모델로 교체
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": messages,
        "temperature": 0.8,
        "top_p": 0.9
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter Error Details:', data.error);
      return res.status(data.error.code || 500).json({ 
        error: `모델 에러: ${data.error.message}` 
      });
    }

    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "서버 통신 중 알 수 없는 오류가 발생했습니다." });
  }
}