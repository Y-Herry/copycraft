export interface GenerateParams {
  systemPrompt: string;
  userPrompt: string;
  model: "deepseek" | "mimo";
  maxTokens?: number;
  temperature?: number;
}

export interface StreamChunk {
  content: string;
  done: boolean;
  tokensUsed?: number;
}

export async function* generateStream(
  params: GenerateParams
): AsyncGenerator<StreamChunk> {
  const { systemPrompt, userPrompt, model, maxTokens = 2000, temperature = 0.7 } = params;

  const baseUrl =
    model === "deepseek"
      ? process.env.DEEPSEEK_BASE_URL
      : process.env.MIMO_BASE_URL;

  const apiKey =
    model === "deepseek"
      ? process.env.DEEPSEEK_API_KEY
      : process.env.MIMO_API_KEY;

  const modelName =
    model === "deepseek" ? "deepseek-chat" : "mimo-v2.5-pro";

  if (!baseUrl || !apiKey) {
    throw new Error(`${model} API key not configured`);
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      const data = trimmed.slice(6);
      if (data === "[DONE]") {
        yield { content: "", done: true };
        return;
      }

      try {
        const json = JSON.parse(data);
        const content = json.choices?.[0]?.delta?.content || "";
        if (content) {
          yield { content, done: false };
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }

  yield { content: "", done: true };
}
