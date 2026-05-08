"use client";

import { useState } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();
      console.log("[login] csrfToken:", csrfToken ? "exists" : "missing");

      // Step 2: POST credentials directly
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          password,
          csrfToken,
          callbackUrl: "/generate",
          "authjs.callback-url": "https://copycraft-mu.vercel.app/login",
          "authjs.csrf-token": csrfToken,
        }),
        redirect: "manual",
      });

      console.log("[login] response status:", res.status);
      console.log("[login] response headers:");
      for (const [key, value] of res.headers.entries()) {
        if (key.toLowerCase().includes("cookie") || key.toLowerCase().includes("location")) {
          console.log(`  ${key}: ${value}`);
        }
      }

      // Step 3: Check Set-Cookie
      const setCookies = res.headers.getSetCookie?.() ?? [];
      console.log("[login] Set-Cookie headers:", setCookies.length > 0 ? setCookies : "NONE");

      const location = res.headers.get("location");
      console.log("[login] redirect location:", location);

      if (res.status >= 300 && res.status < 400 && location) {
        window.location.href = location;
      } else {
        // Try parsing response
        const text = await res.text();
        console.log("[login] response body (first 500 chars):", text.substring(0, 500));
      }
    } catch (err) {
      console.error("[login] exception:", err);
      setError("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">欢迎回来</CardTitle>
        <CardDescription>登录你的 CopyCraft 账号</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>
          <p className="text-sm text-muted-foreground">
            还没有账号？{" "}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
