export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  // 키 체크
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key가 설정되지 않았습니다. Vercel Settings를 확인하세요.' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com", // 필수 헤더 추가
        "X-Title": "GEMAI Prototype"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: messages,
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: '서버 통신 중 오류가 발생했습니다.' });
  }
}