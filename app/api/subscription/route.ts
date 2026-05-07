import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, type PlanKey } from "@/lib/constants";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [subscription, usage] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.usageRecord.findUnique({
      where: { userId_month: { userId, month } },
    }),
  ]);

  const planKey = (subscription?.plan || "FREE") as PlanKey;
  const plan = PLANS[planKey];

  return NextResponse.json({
    plan: planKey,
    status: subscription?.status || "ACTIVE",
    usage: {
      count: usage?.count || 0,
      tokensUsed: usage?.tokensUsed || 0,
    },
    limit: plan.monthlyGenerations,
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
  });
}
