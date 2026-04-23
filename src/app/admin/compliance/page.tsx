import { PageHeader } from "@/components/dashboard/PageHeader";
import { dummyAuditLog } from "@/lib/admin-data";
import { formatTimeAgo } from "@/lib/dummy-data";
import { FileText } from "lucide-react";

export default function AdminCompliancePage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Compliance"
        description="Audit log + reportes regulatorios"
      />

      <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16]">
        <div className="border-b border-[#ddcfc9]/[0.06] px-6 py-4">
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Audit log</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">
            Registro completo de acciones en la plataforma
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ddcfc9]/[0.06] text-left">
                <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Timestamp
                </th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Actor
                </th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Acción
                </th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Target
                </th>
                <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  IP
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyAuditLog.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-[#ddcfc9]/[0.04] last:border-0 transition-colors hover:bg-[#ddcfc9]/[0.02]"
                >
                  <td className="px-6 py-4 text-xs text-[#b8a99e]">{formatTimeAgo(e.timestamp)}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04] text-[#b8a99e]">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-mono text-xs text-[#ddcfc9]">{e.actor}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 font-mono text-xs text-[#D4A45A]">{e.action}</td>
                  <td className="px-3 py-4 font-mono text-xs text-[#ddcfc9]">{e.target}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#b8a99e]">{e.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
