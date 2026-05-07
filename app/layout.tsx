import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CopyCraft - AI 文案生成工具",
  description: "全场景 AI 文案生成，支持小红书、抖音、电商、广告语等多种文案类型",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
