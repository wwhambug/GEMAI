// Node.js 환경에서 Gemini 라이브러리를 가져옵니다.
const { GoogleGenerativeAI } = require("@google/generative-ai");

// process.env.GEMINI_API_KEY 환경 변수에서 API 키를 읽어옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Vercel HTTP 요청 핸들러
export default async function handler(request, response) {
  
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = request.body;

    if (!prompt) {
      return response.status(400).json({ error: 'Prompt is required' });
    }

    // ✨ Gemini 2.5 Flash 모델 사용! (모델 ID: gemini-2.5-flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    // API 호출
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 결과를 클라이언트에게 전송 (이때 API 키는 노출되지 않습니다)
    response.status(200).json({ text: text });

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Gemini API 호출 중 오류 발생' });
  }
}