import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { plan } = body;

  if (!plan || plan === "FREE") {
    return NextResponse.json({ error: "无效的套餐" }, { status: 400 });
  }

  // Stripe checkout 尚未配置，返回提示
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      error: "支付功能即将上线，如需升级请联系客服",
    });
  }

  // Stripe 集成（配置好 STRIPE_SECRET_KEY 后启用）
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // const checkoutSession = await stripe.checkout.sessions.create({
  //   customer_email: session.user.email!,
  //   mode: "subscription",
  //   line_items: [{ price: priceId, quantity: 1 }],
  //   success_url: `${process.env.NEXTAUTH_URL}/subscription?success=true`,
  //   cancel_url: `${process.env.NEXTAUTH_URL}/subscription`,
  // });
  // return NextResponse.json({ url: checkoutSession.url });

  return NextResponse.json({
    error: "支付功能即将上线，如需升级请联系客服",
  });
}
