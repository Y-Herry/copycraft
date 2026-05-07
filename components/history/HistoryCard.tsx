"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COPY_TYPES, type CopyTypeKey } from "@/lib/constants";
import { Heart, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  copyType: string;
  modelUsed: string;
  prompt: string;
  output: string;
  tone: string | null;
  isFavorite: boolean;
  createdAt: string;
}

interface HistoryCardProps {
  item: HistoryItem;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
}

export function HistoryCard({ item, onToggleFavorite, onDelete }: HistoryCardProps) {
  const copyTypeConfig = COPY_TYPES[item.copyType as CopyTypeKey];
  const preview = item.output.slice(0, 150) + (item.output.length > 150 ? "..." : "");
  const date = new Date(item.createdAt).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.output);
    toast.success("已复制到剪贴板");
  };

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{copyTypeConfig?.name || item.copyType}</Badge>
            <Badge variant="outline" className="text-xs">
              {item.modelUsed === "deepseek" ? "DeepSeek" : "MiMo"}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{preview}</p>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleFavorite(item.id, item.isFavorite)}
          >
            <Heart
              className={`h-3.5 w-3.5 ${item.isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
