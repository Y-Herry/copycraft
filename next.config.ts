import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma", "wechatpay-node-v3", "alipay-sdk"],
};

export default nextConfig;
