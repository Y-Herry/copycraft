"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

export function DashboardTopbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const initials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
      <div className="lg:hidden">
        <span className="text-lg font-bold">CopyCraft</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {session?.user?.email}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <User className="mr-2 h-4 w-4" />
              账号设置
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
