import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const orderNo = req.nextUrl.searchParams.get("orderNo");

  if (!orderNo) {
    return NextResponse.redirect(new URL("/subscription", req.url));
  }

  const payment = await prisma.payment.findUnique({
    where: { orderNo },
  });

  if (!payment) {
    return NextResponse.redirect(new URL("/subscription", req.url));
  }

  if (payment.status === "PAID") {
    return NextResponse.redirect(
      new URL("/subscription?success=true", req.url)
    );
  }

  // 支付可能还在处理中，轮询一次
  // 前端页面会展示支付状态
  return NextResponse.redirect(
    new URL(`/subscription?pending=${orderNo}`, req.url)
  );
}
