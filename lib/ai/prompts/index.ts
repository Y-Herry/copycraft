import { xiaohongshuPrompt } from "./xiaohongshu";
import { douyinPrompt } from "./douyin";
import { wechatMomentsPrompt } from "./wechat-moments";
import { ecommercePrompt } from "./ecommerce";
import { adCopyPrompt } from "./ad-copy";
import { wechatArticlePrompt } from "./wechat-article";
import { seoArticlePrompt } from "./seo-article";
import { generalPrompt } from "./general";
import type { CopyType } from "@prisma/client";

export interface PromptTemplate {
  system: string;
  buildUserPrompt(input: {
    topic: string;
    keywords?: string;
    tone?: string;
    additionalContext?: string;
  }): string;
}

const promptRegistry: Record<CopyType, PromptTemplate> = {
  XIAOHONGSHU: xiaohongshuPrompt,
  DOUYIN: douyinPrompt,
  WECHAT_MOMENTS: wechatMomentsPrompt,
  ECOMMERCE: ecommercePrompt,
  AD_COPY: adCopyPrompt,
  WECHAT_ARTICLE: wechatArticlePrompt,
  SEO_ARTICLE: seoArticlePrompt,
  GENERAL: generalPrompt,
};

export function getPrompt(copyType: CopyType): PromptTemplate {
  const prompt = promptRegistry[copyType];
  if (!prompt) throw new Error(`Unknown copy type: ${copyType}`);
  return prompt;
}
