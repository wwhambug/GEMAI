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
        // 현재 가장 호출 성공률이 높은 무료 모델로 설정
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": messages
      })
    });

    const data = await response.json();

    if (data.error) {
      // 429 에러(Rate Limit)인 경우 더 친절한 메시지 반환
      const errorMessage = data.error.code === 429 
        ? "현재 사용자가 많아 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요." 
        : data.error.message;
      return res.status(data.error.code || 500).json({ error: errorMessage });
    }

    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "서버 연결에 실패했습니다." });
  }
}