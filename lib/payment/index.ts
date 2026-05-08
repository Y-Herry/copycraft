import { randomBytes } from "crypto";

export { createAlipayOrder, verifyAlipayNotify } from "./alipay";
export { createWechatOrder, verifyWechatNotify } from "./wechat";

export function generateOrderNo(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString("hex");
  return `CC${timestamp}${random}`.toUpperCase();
}
