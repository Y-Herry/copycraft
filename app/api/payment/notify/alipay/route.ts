import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAlipayNotify } from "@/lib/payment";
import { activateSubscription } from "@/lib/payment/activate";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  // 验签
  if (!verifyAlipayNotify(params)) {
    return new NextResponse("fail", { status: 400 });
  }

  const { out_trade_no, trade_no, trade_status, total_amount } = params;

  // 仅处理交易成功通知
  if (trade_status !== "TRADE_SUCCESS" && trade_status !== "TRADE_FINISHED") {
    return new NextResponse("success");
  }

  const payment = await prisma.payment.findUnique({
    where: { orderNo: out_trade_no },
  });

  if (!payment || payment.status === "PAID") {
    return new NextResponse("success");
  }

  // 金额校验（total_amount 单位是元，payment.amount 单位是分）
  if (Math.round(parseFloat(total_amount) * 100) !== payment.amount) {
    return new NextResponse("fail", { status: 400 });
  }

  // 更新支付记录
  await prisma.payment.update({
    where: { orderNo: out_trade_no },
    data: { status: "PAID", tradeNo: trade_no, paidAt: new Date() },
  });

  // 激活订阅
  await activateSubscription(payment.userId, payment.plan, payment.billingCycle);

  return new NextResponse("success");
}
