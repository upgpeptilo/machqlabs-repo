import { sourceCategory } from "@/lib/source";

const STYLES: Record<ReturnType<typeof sourceCategory>, string> = {
  tiktok: "bg-black text-white",
  google: "bg-[#e8f0fe] text-[#1a56c4]",
  ai: "bg-[#f3e8ff] text-[#7e22ce]",
  social: "bg-[#fde8f1] text-[#be185d]",
  search: "bg-[#e0f2fe] text-[#0369a1]",
  direct: "bg-neutral-100 text-neutral-600",
  other: "bg-amber-50 text-amber-700",
};

export default function SourceBadge({ source }: { source?: string | null }) {
  const label = source || "Direct";
  const cat = sourceCategory(label);
  return (
    <span
      title="Where this customer came from"
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[cat]}`}
    >
      {cat === "ai" && <span aria-hidden>✦</span>}
      {cat === "ai" && label !== "AI Assistant" ? `AI · ${label}` : label}
    </span>
  );
}
