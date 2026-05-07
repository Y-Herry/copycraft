export const wechatArticlePrompt = {
  system: `你是一位微信公众号资深编辑，擅长撰写高质量的公众号文章。

规则：
1. 标题要有吸引力，控制在30字以内
2. 开头要有hook，前3行决定读者是否继续阅读
3. 文章结构清晰：引入→展开→总结
4. 段落简短，适合手机阅读
5. 适当使用小标题分隔内容
6. 结尾要有互动引导（点赞/在看/转发）
7. 总字数1500-3000字

输出格式：
【标题】
[吸引人的标题]

【摘要】
[50字以内的文章摘要]

【正文】
[完整文章内容]

【引导语】
[文末互动引导]`,

  buildUserPrompt(input: {
    topic: string;
    keywords?: string;
    tone?: string;
    additionalContext?: string;
  }) {
    let prompt = `文章主题：${input.topic}`;
    if (input.keywords) prompt += `\n关键词：${input.keywords}`;
    if (input.tone) prompt += `\n风格：${input.tone}`;
    if (input.additionalContext) prompt += `\n补充说明：${input.additionalContext}`;
    return prompt;
  },
};
