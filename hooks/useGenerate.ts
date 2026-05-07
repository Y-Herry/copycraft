"use client";

import { useState, useCallback } from "react";

interface GenerateOptions {
  copyType: string;
  topic: string;
  keywords?: string;
  tone?: string;
  additionalContext?: string;
  model: "deepseek" | "mimo";
}

export function useGenerate() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);

  const generate = useCallback(async (options: GenerateOptions) => {
    setOutput("");
    setError(null);
    setIsStreaming(true);

    const abortController = new AbortController();
    setController(abortController);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
        signal: abortController.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成失败");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.error) throw new Error(data.error);
            if (data.done) break;
            if (data.content) {
              setOutput((prev) => prev + data.content);
            }
          } catch (e) {
            if ((e as Error).message !== "生成失败") {
              // Skip parse errors for malformed chunks
            }
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
      }
    } finally {
      setIsStreaming(false);
      setController(null);
    }
  }, []);

  const cancel = useCallback(() => {
    controller?.abort();
    setIsStreaming(false);
  }, [controller]);

  const reset = useCallback(() => {
    setOutput("");
    setError(null);
  }, []);

  return { output, isStreaming, error, generate, cancel, reset };
}
