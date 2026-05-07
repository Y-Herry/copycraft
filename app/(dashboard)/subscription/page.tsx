"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, type PlanKey } from "@/lib/constants";
import { toast } from "sonner";
import { Check, Zap, Crown, Building2 } from "lucide-react";

interface SubscriptionData {
  plan: PlanKey;
  status: string;
  usage: { count: number; tokensUsed: number };
  limit: number;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (plan: PlanKey) => {
    if (plan === "FREE") return;
    setUpgrading(plan);
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        toast.error(result.error);
      } else {
        toast.info("支付功能即将上线，敬请期待！");
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">订阅管理</h1>
        <p className="text-muted-foreground">管理你的套餐和用量</p>
      </div>

      {/* Current Usage */}
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
          <p className="mt-2 text-xs text-muted-foreground">
            当前套餐：{PLANS[data?.plan || "FREE"].name}
          </p>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
          ([key, plan]) => {
            const Icon = planIcons[key];
            const isCurrent = data?.plan === key;
            return (
              <Card
                key={key}
                className={`relative ${isCurrent ? "border-primary shadow-lg" : ""}`}
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
                    <span className="text-3xl font-bold">
                      ¥{plan.priceMonthly}
                    </span>
                    <span className="text-muted-foreground">/月</span>
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
                    disabled={isCurrent || upgrading === key}
                    onClick={() => handleUpgrade(key)}
                  >
                    {isCurrent
                      ? "当前套餐"
                      : upgrading === key
                        ? "处理中..."
                        : key === "FREE"
                          ? "降级"
                          : "立即升级"}
                  </Button>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
}
