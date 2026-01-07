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
        // 'meta-llama/llama-3.1-8b-instruct:free' 대신 표준 경로 사용
        "model": "meta-llama/llama-3.1-8b-instruct", 
        "messages": messages,
        "temperature": 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      // 429(Too many requests) 대응 메시지 포함
      const msg = data.error.code === 429 ? "사용자가 많아 잠시 제한되었습니다. 1분 뒤 시도해주세요." : data.error.message;
      return res.status(data.error.code || 500).json({ error: msg });
    }

    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "서버 통신 오류가 발생했습니다." });
  }
}