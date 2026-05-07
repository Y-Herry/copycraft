import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/constants";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import Link from "next/link";

const planIcons = {
  FREE: Zap,
  PRO: Crown,
  ENTERPRISE: Building2,
};

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">简单透明的定价</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            选择适合你的套餐，随时升级或降级
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {(Object.entries(PLANS) as [string, (typeof PLANS)[keyof typeof PLANS]][]).map(
            ([key, plan]) => {
              const Icon = planIcons[key as keyof typeof planIcons];
              const isPro = key === "PRO";
              return (
                <Card
                  key={key}
                  className={`relative ${isPro ? "border-primary shadow-lg scale-105" : ""}`}
                >
                  {isPro && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x/2">
                      最受欢迎
                    </Badge>
                  )}
                  <CardHeader className="text-center pt-8">
                    <Icon className="mx-auto h-12 w-12 text-primary mb-3" />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">¥{plan.priceMonthly}</span>
                      <span className="text-muted-foreground">/月</span>
                    </div>
                    {plan.priceYearly > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        年付 ¥{plan.priceYearly}（省 20%）
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/register"
                      className={`inline-flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        isPro
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border bg-background hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {key === "FREE" ? "免费开始" : "立即升级"}
                    </Link>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
