import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, type PlanKey } from "@/lib/constants";
import { generateOrderNo, createAlipayOrder, createWechatOrder } from "@/lib/payment";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { plan, billingCycle, method } = body as {
    plan?: string;
    billingCycle?: "monthly" | "yearly";
    method?: "alipay" | "wechat";
  };

  if (!plan || plan === "FREE" || !PLANS[plan as PlanKey]) {
    return NextResponse.json({ error: "无效的套餐" }, { status: 400 });
  }

  if (!billingCycle || !["monthly", "yearly"].includes(billingCycle)) {
    return NextResponse.json({ error: "请选择计费周期" }, { status: 400 });
  }

  if (!method || !["alipay", "wechat"].includes(method)) {
    return NextResponse.json({ error: "请选择支付方式" }, { status: 400 });
  }

  const planConfig = PLANS[plan as PlanKey];
  const amount =
    billingCycle === "yearly" ? planConfig.priceYearly : planConfig.priceMonthly;

  if (amount <= 0) {
    return NextResponse.json({ error: "该套餐无需付费" }, { status: 400 });
  }

  const userId = session.user.id;
  const orderNo = generateOrderNo();
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";

  // 创建支付记录
  await prisma.payment.create({
    data: {
      userId,
      orderNo,
      method: method === "alipay" ? "ALIPAY" : "WECHAT",
      plan: plan as PlanKey,
      billingCycle: billingCycle === "monthly" ? "MONTHLY" : "YEARLY",
      amount: Math.round(amount * 100), // 转为分
      status: "PENDING",
    },
  });

  try {
    if (method === "alipay") {
      const url = await createAlipayOrder({
        orderNo,
        amount,
        subject: `CopyCraft ${planConfig.name} - ${billingCycle === "monthly" ? "月付" : "年付"}`,
        returnUrl: `${baseUrl}/api/payment/return?orderNo=${orderNo}`,
        notifyUrl: `${baseUrl}/api/payment/notify/alipay`,
      });
      return NextResponse.json({ url, orderNo });
    }

    // 微信支付 - Native 模式返回 code_url
    const codeUrl = await createWechatOrder({
      orderNo,
      amount: Math.round(amount * 100),
      description: `CopyCraft ${planConfig.name} - ${billingCycle === "monthly" ? "月付" : "年付"}`,
      notifyUrl: `${baseUrl}/api/payment/notify/wechat`,
    });
    return NextResponse.json({ codeUrl, orderNo });
  } catch (error) {
    console.error("创建支付订单失败:", error);
    return NextResponse.json(
      { error: "创建支付订单失败，请稍后重试" },
      { status: 500 }
    );
  }
}
