document.getElementById('submitButton').addEventListener('click', async () => {
    const prompt = document.getElementById('promptInput').value;
    const responseArea = document.getElementById('responseArea');
    
    responseArea.textContent = '생성 중...';

    try {
        // 1. 우리 Vercel 서버의 API 함수(/api/generate)를 호출합니다.
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }) // 프롬프트를 JSON으로 전송
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 2. 서버로부터 받은 JSON 응답을 파싱합니다.
        const data = await response.json();
        
        // 3. 결과를 화면에 표시합니다.
        responseArea.textContent = data.text;

    } catch (error) {
        console.error(error);
        responseArea.textContent = '오류가 발생했습니다: ' + error.message;
    }
});