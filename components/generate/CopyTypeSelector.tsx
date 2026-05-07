"use client";

import { cn } from "@/lib/utils";
import { COPY_TYPES, type CopyTypeKey } from "@/lib/constants";
import {
  BookOpen,
  Music,
  MessageCircle,
  ShoppingBag,
  Megaphone,
  FileText,
  Search,
  PenTool,
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

interface CopyTypeSelectorProps {
  value: CopyTypeKey;
  onChange: (value: CopyTypeKey) => void;
}

export function CopyTypeSelector({ value, onChange }: CopyTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {(Object.entries(COPY_TYPES) as [CopyTypeKey, (typeof COPY_TYPES)[CopyTypeKey]][]).map(
        ([key, config]) => {
          const Icon = iconMap[config.icon] || PenTool;
          const isSelected = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <div className={cn("text-sm font-medium", isSelected && "text-primary")}>
                  {config.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {config.description}
                </div>
              </div>
            </button>
          );
        }
      )}
    </div>
  );
}
