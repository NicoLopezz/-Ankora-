import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AdminMercadoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Mercado P2P"
        description="Órdenes globales, matching, moderación — próxima iteración"
      />
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#ddcfc9]/10 text-sm text-[#b8a99e]">
        Order books globales, cancelación por moderación, detección de wash trading
      </div>
    </div>
  );
}
