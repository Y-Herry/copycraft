"use client";

import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: "deepseek" | "mimo";
  onChange: (value: "deepseek" | "mimo") => void;
  disabled?: boolean;
}

const models = [
  {
    id: "deepseek" as const,
    name: "DeepSeek",
    description: "性价比高，中文能力强",
  },
  {
    id: "mimo" as const,
    name: "MiMo",
    description: "小米大模型，创意能力强",
  },
];

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <div className="flex gap-3">
      {models.map((model) => (
        <button
          key={model.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(model.id)}
          className={cn(
            "flex-1 rounded-lg border-2 p-3 text-left transition-all",
            disabled && "opacity-50 cursor-not-allowed",
            value === model.id
              ? "border-primary bg-primary/5"
              : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
          )}
        >
          <div className="text-sm font-medium">{model.name}</div>
          <div className="text-xs text-muted-foreground">{model.description}</div>
        </button>
      ))}
    </div>
  );
}
