import WxPay from "wechatpay-node-v3";
import { readFileSync } from "fs";

function getWxPay() {
  const appId = process.env.WECHAT_APP_ID;
  const mchId = process.env.WECHAT_MCH_ID;
  const apiKeyV3 = process.env.WECHAT_API_KEY_V3;
  const serialNo = process.env.WECHAT_SERIAL_NO;
  const privateKeyPath = process.env.WECHAT_PRIVATE_KEY;

  if (!appId || !mchId || !apiKeyV3 || !serialNo || !privateKeyPath) {
    throw new Error("WeChat Pay 未配置，请检查环境变量");
  }

  const privateKey = readFileSync(privateKeyPath, "utf-8");

  return new WxPay({
    appid: appId,
    mchid: mchId,
    publicKey: Buffer.from(""), // v3 API 不需要公钥
    privateKey: Buffer.from(privateKey),
    serial_no: serialNo,
    key: apiKeyV3,
  });
}

export async function createWechatOrder(params: {
  orderNo: string;
  amount: number; // 分
  description: string;
  notifyUrl: string;
}): Promise<string> {
  const pay = getWxPay();

  const result = await pay.transactions_native({
    description: params.description,
    out_trade_no: params.orderNo,
    notify_url: params.notifyUrl,
    amount: {
      total: params.amount,
      currency: "CNY",
    },
  });

  // Native 支付返回 code_url，用于生成二维码
  return (result as any).code_url as string;
}

export async function verifyWechatNotify(headers: Headers, body: string): Promise<Record<string, unknown> | null> {
  const pay = getWxPay();
  const timestamp = headers.get("wechatpay-timestamp") || "";
  const nonce = headers.get("wechatpay-nonce") || "";
  const serial = headers.get("wechatpay-serial") || "";
  const signature = headers.get("wechatpay-signature") || "";

  try {
    const verified = await pay.verifySign({
      timestamp,
      nonce,
      body,
      serial,
      signature,
    });
    if (!verified) return null;

    // 解密通知数据
    const notification = JSON.parse(body);
    if (notification.resource) {
      const decrypted = pay.decipher_gcm<string>(
        notification.resource.ciphertext,
        notification.resource.associated_data,
        notification.resource.nonce,
        process.env.WECHAT_API_KEY_V3!,
      );
      return JSON.parse(decrypted);
    }
    return notification;
  } catch {
    return null;
  }
}
