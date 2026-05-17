exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { systemPrompt, userPrompt, context } = JSON.parse(event.body || "{}");

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다." })
      };
    }

    if (!userPrompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "userPrompt가 필요합니다." })
      };
    }

    const model = process.env.OPENAI_MODEL || "gpt-5.5-mini";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: systemPrompt || "You are a helpful assistant."
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `${userPrompt}\n\n[앱에서 전달한 현재 맥락]\n${JSON.stringify(context || {}, null, 2)}`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          error: data.error?.message || "OpenAI API 호출 실패",
          detail: data
        })
      };
    }

    const answer =
      data.output_text ||
      data.output?.flatMap(item => item.content || [])
        ?.map(part => part.text || "")
        ?.join("\n")
        ?.trim() ||
      "응답을 생성하지 못했습니다.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: error.message })
    };
  }
};
