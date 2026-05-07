"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COPY_TYPES, type CopyTypeKey } from "@/lib/constants";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Music,
  MessageCircle,
  ShoppingBag,
  Megaphone,
  FileText,
  Search,
  PenTool,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Music,
  MessageCircle,
  ShoppingBag,
  Megaphone,
  FileText,
  Search,
  PenTool,
};

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">文案模板</h1>
        <p className="text-muted-foreground">选择模板快速开始生成</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(Object.entries(COPY_TYPES) as [CopyTypeKey, (typeof COPY_TYPES)[CopyTypeKey]][]).map(
          ([key, config]) => {
            const Icon = iconMap[config.icon] || PenTool;
            return (
              <Card
                key={key}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                onClick={() => router.push(`/generate?type=${key}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{config.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {config.description}
                  </p>
                  <Button variant="ghost" size="sm" className="w-full gap-1">
                    使用模板
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
}
