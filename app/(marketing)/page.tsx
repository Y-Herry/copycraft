import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  BookOpen,
  Music,
  ShoppingBag,
  Megaphone,
  FileText,
  Search,
  Zap,
  Clock,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "小红书种草",
    description: "生成吸引眼球的种草笔记，配合热门标签",
  },
  {
    icon: Music,
    title: "抖音文案",
    description: "创作抓人眼球的短视频文案和口播脚本",
  },
  {
    icon: ShoppingBag,
    title: "电商文案",
    description: "高转化商品描述、卖点提炼、促销文案",
  },
  {
    icon: Megaphone,
    title: "广告语",
    description: "朗朗上口的品牌广告语和营销文案",
  },
  {
    icon: FileText,
    title: "公众号文章",
    description: "高质量长文章，适合深度内容传播",
  },
  {
    icon: Search,
    title: "SEO 优化",
    description: "搜索引擎友好的文章，提升网站排名",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "秒级生成",
    description: "AI 流式输出，实时看到文案生成过程",
  },
  {
    icon: Clock,
    title: "节省时间",
    description: "从构思到成稿，从小时缩短到分钟",
  },
  {
    icon: Shield,
    title: "双模型保障",
    description: "DeepSeek + MiMo 双模型，质量更有保障",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              AI 驱动的文案创作平台
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              一键生成
              <span className="text-primary">全场景</span>
              优质文案
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              小红书、抖音、电商、广告语... 8 大文案类型，AI 帮你搞定。
              告别文案焦虑，提升 10 倍效率。
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                免费开始使用
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                查看定价
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">8 大文案类型，覆盖全场景</h2>
            <p className="mt-4 text-muted-foreground">
              无论你是自媒体人、电商卖家还是品牌方，都能找到适合的文案
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">为什么选择 CopyCraft</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">准备好提升文案效率了吗？</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            免费注册，每月可生成 20 篇文案
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            免费开始
          </Link>
        </div>
      </section>
    </>
  );
}
