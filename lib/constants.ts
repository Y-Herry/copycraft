export const PLANS = {
  FREE: {
    name: "免费版",
    nameEn: "Free",
    monthlyGenerations: 20,
    maxTokensPerGeneration: 2000,
    allowedModels: ["deepseek"] as const,
    features: ["基础文案生成", "生成历史(7天)", "DeepSeek 模型"],
    priceMonthly: 0,
    priceYearly: 0,
  },
  PRO: {
    name: "专业版",
    nameEn: "Pro",
    monthlyGenerations: 300,
    maxTokensPerGeneration: 4000,
    allowedModels: ["deepseek", "mimo"] as const,
    features: [
      "全部文案类型",
      "双模型选择",
      "无限历史记录",
      "收藏功能",
      "优先响应",
    ],
    priceMonthly: 49,
    priceYearly: 468,
  },
  ENTERPRISE: {
    name: "企业版",
    nameEn: "Enterprise",
    monthlyGenerations: -1,
    maxTokensPerGeneration: 8000,
    allowedModels: ["deepseek", "mimo"] as const,
    features: [
      "全部功能",
      "API 访问",
      "团队协作",
      "专属客服",
      "自定义模板",
    ],
    priceMonthly: 199,
    priceYearly: 1908,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export const COPY_TYPES = {
  XIAOHONGSHU: {
    name: "小红书",
    icon: "BookOpen",
    description: "种草笔记、好物分享",
    color: "#ff2442",
  },
  DOUYIN: {
    name: "抖音",
    icon: "Music",
    description: "短视频文案、口播脚本",
    color: "#000000",
  },
  WECHAT_MOMENTS: {
    name: "朋友圈",
    icon: "MessageCircle",
    description: "朋友圈文案、日常分享",
    color: "#07c160",
  },
  ECOMMERCE: {
    name: "电商文案",
    icon: "ShoppingBag",
    description: "商品标题、详情页、卖点",
    color: "#ff6600",
  },
  AD_COPY: {
    name: "广告语",
    icon: "Megaphone",
    description: "品牌广告、促销文案",
    color: "#7c3aed",
  },
  WECHAT_ARTICLE: {
    name: "公众号文章",
    icon: "FileText",
    description: "长文章、深度内容",
    color: "#1a73e8",
  },
  SEO_ARTICLE: {
    name: "SEO 文章",
    icon: "Search",
    description: "搜索引擎优化文章",
    color: "#34a853",
  },
  GENERAL: {
    name: "通用文案",
    icon: "PenTool",
    description: "任意场景文案生成",
    color: "#6b7280",
  },
} as const;

export type CopyTypeKey = keyof typeof COPY_TYPES;

export const TONES = [
  { value: "professional", label: "专业正式" },
  { value: "casual", label: "轻松随意" },
  { value: "humorous", label: "幽默风趣" },
  { value: "emotional", label: "感性走心" },
  { value: "concise", label: "简洁有力" },
  { value: "storytelling", label: "故事叙述" },
] as const;
