"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  PenTool,
  History,
  LayoutTemplate,
  CreditCard,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/generate", label: "生成文案", icon: PenTool },
  { href: "/history", label: "历史记录", icon: History },
  { href: "/templates", label: "文案模板", icon: LayoutTemplate },
  { href: "/subscription", label: "订阅管理", icon: CreditCard },
  { href: "/settings", label: "账号设置", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/30 lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">CopyCraft</span>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
