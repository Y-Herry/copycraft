"use client";

import { useState, useEffect, useCallback } from "react";
import { HistoryCard } from "@/components/history/HistoryCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COPY_TYPES, type CopyTypeKey } from "@/lib/constants";
import { Heart, Loader2 } from "lucide-react";
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

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copyType, setCopyType] = useState<string>("all");
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (copyType !== "all") params.set("copyType", copyType);
      if (showFavorites) params.set("favorite", "true");

      const res = await fetch(`/api/history?${params}`);
      const data = await res.json();
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  }, [page, copyType, showFavorites]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await fetch(`/api/history/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !isFavorite }),
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFavorite: !isFavorite } : item
        )
      );
    } catch {
      toast.error("操作失败");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("已删除");
    } catch {
      toast.error("删除失败");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">历史记录</h1>
          <p className="text-muted-foreground">查看和管理你的生成记录</p>
        </div>
        <div className="flex gap-3">
          <Select value={copyType} onValueChange={(v) => setCopyType(v || "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="文案类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {(Object.entries(COPY_TYPES) as [CopyTypeKey, typeof COPY_TYPES[CopyTypeKey]][]).map(
                ([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Button
            variant={showFavorites ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Heart className={`h-4 w-4 ${showFavorites ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          暂无记录
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
