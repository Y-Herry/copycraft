import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">账号设置</h1>
        <p className="text-muted-foreground">管理你的账号信息</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">个人信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>姓名</Label>
            <Input defaultValue={session.name || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>邮箱</Label>
            <Input defaultValue={session.email || ""} disabled />
          </div>
          <p className="text-xs text-muted-foreground">
            如需修改信息，请联系客服
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
