# FireLaw AI API WebApp

## 구조
- `index.html`: 사용자 화면
- `netlify/functions/firelaw.js`: OpenAI API 호출 서버리스 함수
- `netlify.toml`: Netlify 배포 설정

## Netlify 환경변수
Netlify Site settings > Environment variables에서 아래 값을 추가하세요.

- `OPENAI_API_KEY`: OpenAI API Key
- `OPENAI_MODEL`: 선택사항. 예: `gpt-5.5-mini`

## 핵심
API 키는 절대 HTML에 넣으면 안 됩니다.
반드시 Netlify Functions 같은 서버 측 코드에서 호출해야 합니다.
