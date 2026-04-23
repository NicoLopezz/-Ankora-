import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AdminProyectosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Fideicomisos"
        description="Gestión de proyectos tokenizados — próxima iteración"
      />
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#ddcfc9]/10 text-sm text-[#b8a99e]">
        Cap table, fondeo, dividendos a distribuir (próximamente)
      </div>
    </div>
  );
}
