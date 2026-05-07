"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyTypeSelector } from "./CopyTypeSelector";
import { ModelSelector } from "./ModelSelector";
import { StreamingOutput } from "./StreamingOutput";
import { useGenerate } from "@/hooks/useGenerate";
import { TONES, type CopyTypeKey } from "@/lib/constants";
import { Sparkles, Square, RotateCcw } from "lucide-react";

export function GenerateForm() {
  const [copyType, setCopyType] = useState<CopyTypeKey>("XIAOHONGSHU");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [model, setModel] = useState<"deepseek" | "mimo">("deepseek");

  const { output, isStreaming, error, generate, cancel, reset } = useGenerate();

  const handleGenerate = () => {
    if (!topic.trim()) return;
    generate({
      copyType,
      topic,
      keywords: keywords || undefined,
      tone: tone || undefined,
      additionalContext: additionalContext || undefined,
      model,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Input Form */}
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">选择文案类型</Label>
          <div className="mt-3">
            <CopyTypeSelector value={copyType} onChange={setCopyType} />
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">AI 模型</Label>
          <div className="mt-3">
            <ModelSelector value={model} onChange={setModel} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">
              主题/需求 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="topic"
              placeholder="描述你想要生成的文案内容，例如：推荐一款夏日防晒霜，适合油性皮肤..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="keywords">关键词（可选）</Label>
            <Input
              id="keywords"
              placeholder="用逗号分隔，例如：防晒,清爽,平价"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="tone">风格语气（可选）</Label>
            <Select value={tone} onValueChange={(v) => setTone(v || "")}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="选择风格" />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="context">补充说明（可选）</Label>
            <Textarea
              id="context"
              placeholder="其他要求或背景信息..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {isStreaming ? (
            <Button onClick={cancel} variant="destructive" className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              停止生成
            </Button>
          ) : (
            <>
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="flex-1"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                生成文案
              </Button>
              {output && (
                <Button onClick={reset} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  重置
                </Button>
              )}
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          按 <kbd className="rounded border px-1 py-0.5 text-[10px]">⌘</kbd> +{" "}
          <kbd className="rounded border px-1 py-0.5 text-[10px]">Enter</kbd> 快速生成
        </p>
      </div>

      {/* Right: Output */}
      <div>
        <Label className="text-base font-semibold">生成结果</Label>
        <div className="mt-3">
          <StreamingOutput output={output} isStreaming={isStreaming} error={error} />
        </div>
      </div>
    </div>
  );
}
