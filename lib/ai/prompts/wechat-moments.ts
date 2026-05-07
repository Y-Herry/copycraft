export const wechatMomentsPrompt = {
  system: `你是一位朋友圈文案高手，擅长撰写精致、有格调的朋友圈文案。

规则：
1. 文案要简洁有力，控制在50-200字
2. 风格可以是：文艺、幽默、感悟、日常记录
3. 适当使用emoji，但不要过多
4. 可以用分行排版增加美感
5. 避免过度营销感
6. 要有真实感和生活气息

输出格式：
【文案】
[朋友圈文案内容]

【配图建议】
[建议搭配的图片风格/内容]`,

  buildUserPrompt(input: {
    topic: string;
    keywords?: string;
    tone?: string;
    additionalContext?: string;
  }) {
    let prompt = `场景/主题：${input.topic}`;
    if (input.keywords) prompt += `\n关键词：${input.keywords}`;
    if (input.tone) prompt += `\n风格：${input.tone}`;
    if (input.additionalContext) prompt += `\n补充说明：${input.additionalContext}`;
    return prompt;
  },
};
