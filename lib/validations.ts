import { z } from "zod";

export const generateSchema = z.object({
  copyType: z.enum([
    "XIAOHONGSHU",
    "DOUYIN",
    "WECHAT_MOMENTS",
    "ECOMMERCE",
    "AD_COPY",
    "WECHAT_ARTICLE",
    "SEO_ARTICLE",
    "GENERAL",
  ]),
  topic: z.string().min(1, "请输入主题").max(500, "主题过长"),
  keywords: z.string().max(200).optional(),
  tone: z.string().optional(),
  additionalContext: z.string().max(1000).optional(),
  model: z.enum(["deepseek", "mimo"]).default("deepseek"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符").max(50),
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(6, "密码至少6个字符").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(1, "请输入密码"),
});
