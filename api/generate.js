import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(request, response) {
  
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = request.body;

    if (!prompt) {
      return response.status(400).json({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    response.status(200).json({ text: text });

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Gemini API 호출 중 오류 발생' });
  }
}