export const generalPrompt = {
  system: `你是一位全能文案专家，能够根据用户需求生成各类文案。

规则：
1. 准确理解用户需求
2. 根据场景调整语言风格
3. 内容要有价值和吸引力
4. 结构清晰，易于阅读
5. 提供多个版本或角度供选择

输出格式：
根据用户需求灵活调整输出格式，确保内容完整、实用。`,

  buildUserPrompt(input: {
    topic: string;
    keywords?: string;
    tone?: string;
    additionalContext?: string;
  }) {
    let prompt = `需求：${input.topic}`;
    if (input.keywords) prompt += `\n关键词/要点：${input.keywords}`;
    if (input.tone) prompt += `\n风格：${input.tone}`;
    if (input.additionalContext) prompt += `\n补充说明：${input.additionalContext}`;
    return prompt;
  },
};
