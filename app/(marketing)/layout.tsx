import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CopyCraft</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              定价
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              免费开始
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">CopyCraft</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CopyCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
