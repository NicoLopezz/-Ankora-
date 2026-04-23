import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  tone?: "default" | "gold";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#ddcfc9]/[0.08] bg-[#ddcfc9]/[0.02] px-6 py-12 text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          tone === "gold" ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="max-w-sm space-y-1">
        <p className="text-sm font-medium text-[#ddcfc9]">{title}</p>
        {description && <p className="text-xs leading-relaxed text-[#b8a99e]">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-4 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a]"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
