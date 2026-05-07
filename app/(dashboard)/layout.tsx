import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
