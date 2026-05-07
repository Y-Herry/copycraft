"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StreamingOutputProps {
  output: string;
  isStreaming: boolean;
  error: string | null;
}

export function StreamingOutput({ output, isStreaming, error }: StreamingOutputProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <Card className="flex h-[500px] items-center justify-center border-destructive/50 bg-destructive/5 p-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">生成失败</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  if (!output && !isStreaming) {
    return (
      <Card className="flex h-[500px] items-center justify-center p-6">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">选择文案类型，输入主题</p>
          <p className="mt-2 text-sm">AI 将为你生成优质文案</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative h-[500px] overflow-hidden">
      {output && (
        <div className="absolute right-3 top-3 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-8 gap-1.5"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "已复制" : "复制"}
          </Button>
        </div>
      )}
      <div className="h-full overflow-y-auto p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
          {output}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
          )}
        </div>
        <div ref={endRef} />
      </div>
    </Card>
  );
}
