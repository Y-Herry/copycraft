import { AlipaySdk } from "alipay-sdk";

function getAlipaySdk() {
  const appId = process.env.ALIPAY_APP_ID;
  const privateKey = process.env.ALIPAY_PRIVATE_KEY;
  const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;

  if (!appId || !privateKey || !alipayPublicKey) {
    throw new Error("Alipay SDK 未配置，请检查环境变量");
  }

  return new AlipaySdk({
    appId,
    privateKey,
    alipayPublicKey,
    gateway: process.env.ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do",
    signType: "RSA2",
    camelcase: true,
  });
}

export async function createAlipayOrder(params: {
  orderNo: string;
  amount: number; // 元
  subject: string;
  returnUrl: string;
  notifyUrl: string;
}): Promise<string> {
  const sdk = getAlipaySdk();

  const result = sdk.pageExecute("alipay.trade.wap.pay", {
    method: "GET",
    bizContent: {
      out_trade_no: params.orderNo,
      total_amount: params.amount.toFixed(2),
      subject: params.subject,
      product_code: "QUICK_WAP_WAY",
    },
    returnUrl: params.returnUrl,
    notifyUrl: params.notifyUrl,
  });

  return result as unknown as string;
}

export function verifyAlipayNotify(params: Record<string, string>): boolean {
  const sdk = getAlipaySdk();
  return sdk.checkNotifySign(params);
}
