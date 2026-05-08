import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["wechatpay-node-v3", "alipay-sdk"],
};

export default nextConfig;
