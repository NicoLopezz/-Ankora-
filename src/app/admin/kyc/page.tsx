import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AdminKycPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Cola KYC"
        description="Verificación de nuevos clientes — próxima iteración"
      />
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#ddcfc9]/10 text-sm text-[#b8a99e]">
        Cola de KYC con docs + acciones aprobar/rechazar (próximamente)
      </div>
    </div>
  );
}
