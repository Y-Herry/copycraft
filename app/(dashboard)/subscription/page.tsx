"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, type PlanKey } from "@/lib/constants";
import { toast } from "sonner";
import { Check, Zap, Crown, Building2, Clock, AlertTriangle } from "lucide-react";

interface SubscriptionData {
  plan: PlanKey;
  status: string;
  usage: { count: number; tokensUsed: number };
  limit: number;
  expiresAt: string | null;
}

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showPayDialog, setShowPayDialog] = useState<PlanKey | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("支付成功！套餐已激活");
      // 刷新订阅数据
      fetch("/api/subscription")
        .then((res) => res.json())
        .then(setData);
    }
  }, [searchParams]);

  const handleUpgrade = async (plan: PlanKey, method: "alipay" | "wechat") => {
    if (plan === "FREE") return;
    setUpgrading(`${plan}-${method}`);
    setShowPayDialog(null);

    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle, method }),
      });
      const result = await res.json();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (method === "alipay" && result.url) {
        // 支付宝：跳转到支付页面
        window.location.href = result.url;
      } else if (method === "wechat" && result.codeUrl) {
        // 微信支付：显示二维码
        setQrCodeUrl(result.codeUrl);
      }
    } catch {
      toast.error("操作失败，请稍后重试");
    } finally {
      setUpgrading(null);
    }
  };

  const planIcons = {
    FREE: Zap,
    PRO: Crown,
    ENTERPRISE: Building2,
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center p-6">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  const usageCount = data?.usage?.count || 0;
  const usageLimit = data?.limit || 20;

  const isExpired =
    data?.plan !== "FREE" && data?.expiresAt && new Date(data.expiresAt) < new Date();
  const daysUntilExpiry =
    data?.expiresAt && !isExpired
      ? Math.ceil(
          (new Date(data.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">订阅管理</h1>
        <p className="text-muted-foreground">管理你的套餐和用量</p>
      </div>

      {/* 到期提醒 */}
      {isExpired && (
        <Card className="mb-6 border-destructive bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm">
              你的套餐已过期，已自动降级为免费版。请重新订阅以继续使用完整功能。
            </p>
          </CardContent>
        </Card>
      )}

      {!isExpired && daysUntilExpiry !== null && daysUntilExpiry <= 7 && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="h-5 w-5 text-yellow-600 shrink-0" />
            <p className="text-sm">
              你的套餐将在 {daysUntilExpiry} 天后到期，请及时续费。
            </p>
          </CardContent>
        </Card>
      )}

      {/* 当前用量 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">本月用量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${usageLimit === -1 ? 30 : Math.min((usageCount / usageLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              {usageCount} / {usageLimit === -1 ? "无限" : usageLimit}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>当前套餐：{PLANS[data?.plan || "FREE"].name}</span>
            {data?.expiresAt && !isExpired && (
              <span>
                到期时间：{new Date(data.expiresAt).toLocaleDateString("zh-CN")}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 计费周期切换 */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg border bg-muted p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            月付
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            年付 <span className="text-xs text-green-500">省20%</span>
          </button>
        </div>
      </div>

      {/* 套餐列表 */}
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
          ([key, plan]) => {
            const Icon = planIcons[key];
            const isCurrent = data?.plan === key && !isExpired;
            const price =
              billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            return (
              <Card
                key={key}
                className={`relative overflow-visible ${isCurrent ? "border-primary shadow-lg" : ""}`}
              >
                {isCurrent && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    当前套餐
                  </Badge>
                )}
                <CardHeader className="text-center pt-8">
                  <Icon className="mx-auto h-10 w-10 text-primary mb-2" />
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">¥{price}</span>
                    <span className="text-muted-foreground">
                      /{billingCycle === "monthly" ? "月" : "年"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || upgrading?.startsWith(key)}
                    onClick={() => {
                      if (key === "FREE") return;
                      setShowPayDialog(key);
                    }}
                  >
                    {isCurrent
                      ? "当前套餐"
                      : upgrading?.startsWith(key)
                        ? "处理中..."
                        : key === "FREE"
                          ? "免费版"
                          : "立即升级"}
                  </Button>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      {/* 支付方式选择弹窗 */}
      {showPayDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-[360px]">
            <CardHeader>
              <CardTitle className="text-lg">选择支付方式</CardTitle>
              <p className="text-sm text-muted-foreground">
                {PLANS[showPayDialog].name} ·{" "}
                {billingCycle === "monthly" ? "月付" : "年付"} · ¥
                {billingCycle === "monthly"
                  ? PLANS[showPayDialog].priceMonthly
                  : PLANS[showPayDialog].priceYearly}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                disabled={!!upgrading}
                onClick={() => handleUpgrade(showPayDialog, "alipay")}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#1677FF" />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    支
                  </text>
                </svg>
                支付宝支付
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                disabled={!!upgrading}
                onClick={() => handleUpgrade(showPayDialog, "wechat")}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#07C160" />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    微
                  </text>
                </svg>
                微信支付
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowPayDialog(null)}
              >
                取消
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 微信支付二维码弹窗 */}
      {qrCodeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-[360px]">
            <CardHeader>
              <CardTitle className="text-lg">微信扫码支付</CardTitle>
              <p className="text-sm text-muted-foreground">
                请使用微信扫描下方二维码完成支付
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {/* 二维码通过第三方库生成，这里用 img 占位 */}
              <div className="w-48 h-48 border rounded-lg flex items-center justify-center bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="微信支付二维码"
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                支付完成后页面将自动刷新
              </p>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setQrCodeUrl(null)}
              >
                关闭
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
