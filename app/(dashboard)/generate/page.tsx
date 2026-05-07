import { GenerateForm } from "@/components/generate/GenerateForm";

export default function GeneratePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI 文案生成</h1>
        <p className="text-muted-foreground">
          选择文案类型，输入主题，AI 为你生成优质文案
        </p>
      </div>
      <GenerateForm />
    </div>
  );
}
