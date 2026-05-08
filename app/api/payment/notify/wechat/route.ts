import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWechatNotify } from "@/lib/payment";
import { activateSubscription } from "@/lib/payment/activate";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const data = await verifyWechatNotify(req.headers, body);
  if (!data) {
    return NextResponse.json({ code: "FAIL", message: "签名验证失败" }, { status: 400 });
  }

  const { out_trade_no, transaction_id, trade_state, amount } = data as {
    out_trade_no: string;
    transaction_id: string;
    trade_state: string;
    amount: { total: number; payer_total: number };
  };

  if (trade_state !== "SUCCESS") {
    return NextResponse.json({ code: "SUCCESS", message: "OK" });
  }

  const payment = await prisma.payment.findUnique({
    where: { orderNo: out_trade_no },
  });

  if (!payment || payment.status === "PAID") {
    return NextResponse.json({ code: "SUCCESS", message: "OK" });
  }

  // 金额校验
  if (amount.total !== payment.amount) {
    return NextResponse.json({ code: "FAIL", message: "金额不匹配" }, { status: 400 });
  }

  // 更新支付记录
  await prisma.payment.update({
    where: { orderNo: out_trade_no },
    data: { status: "PAID", tradeNo: transaction_id, paidAt: new Date() },
  });

  // 激活订阅
  await activateSubscription(payment.userId, payment.plan, payment.billingCycle);

  return NextResponse.json({ code: "SUCCESS", message: "OK" });
}
