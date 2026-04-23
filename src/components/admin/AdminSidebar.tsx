"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

import { LayoutDashboardIcon, type LayoutDashboardIconHandle } from "@/components/ui/layout-dashboard";
import { UsersIcon, type UsersIconHandle } from "@/components/ui/users";
import { ArrowLeftRightIcon, type ArrowLeftRightIconHandle } from "@/components/ui/arrow-left-right";
import { DollarSignIcon, type DollarSignIconHandle } from "@/components/ui/dollar-sign";
import { ShieldIcon, type ShieldIconHandle } from "@/components/ui/shield";
import { ShieldAlertIcon, type ShieldAlertIconHandle } from "@/components/ui/shield-alert";
import { BuildingIcon, type BuildingIconHandle } from "@/components/ui/building";

type IconHandle =
  | LayoutDashboardIconHandle
  | UsersIconHandle
  | ArrowLeftRightIconHandle
  | DollarSignIconHandle
  | ShieldIconHandle
  | ShieldAlertIconHandle
  | BuildingIconHandle;

type IconComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & { size?: number } & React.RefAttributes<IconHandle>
>;

const navItems: { href: string; label: string; Icon: IconComponent }[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboardIcon as unknown as IconComponent },
  { href: "/admin/usuarios", label: "Clientes", Icon: UsersIcon as unknown as IconComponent },
  { href: "/admin/kyc", label: "Cola KYC", Icon: ShieldIcon as unknown as IconComponent },
  { href: "/admin/proyectos", label: "Fideicomisos", Icon: BuildingIcon as unknown as IconComponent },
  { href: "/admin/compliance", label: "Compliance", Icon: ShieldAlertIcon as unknown as IconComponent },
  { href: "/admin/mercado", label: "Mercado P2P", Icon: ArrowLeftRightIcon as unknown as IconComponent },
  { href: "/admin/finanzas", label: "Tesorería", Icon: DollarSignIcon as unknown as IconComponent },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function NavItem({
  href,
  label,
  Icon,
  isActive,
  collapsed,
}: {
  href: string;
  label: string;
  Icon: IconComponent;
  isActive: boolean;
  collapsed: boolean;
}) {
  const iconRef = useRef<IconHandle>(null);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-[#D4A45A]/10 text-[#D4A45A]"
          : "text-[#b8a99e] hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
      )}
    >
      <Icon ref={iconRef} size={18} className="flex-shrink-0" />
      <span
        className={cn(
          "whitespace-nowrap transition-all duration-300 overflow-hidden",
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-[#D4A45A]/[0.12] bg-[#1f0a08] transition-all duration-300 md:flex",
        collapsed ? "w-[56px]" : "w-60"
      )}
    >
      {/* Logo + ADMIN badge */}
      <div className="flex h-16 items-center overflow-hidden border-b border-[#D4A45A]/[0.12] px-4">
        <Link href="/admin" className="group/logo flex items-center gap-2 min-w-0">
          <span className="h-2.5 w-2.5 rotate-45 rounded-sm bg-[#D4A45A] flex-shrink-0 transition-all duration-500 ease-in-out group-hover/logo:rotate-[135deg]" />
          <div
            className={cn(
              "flex flex-col leading-tight whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            <span className="text-xl font-bold tracking-tight text-[#ddcfc9]">Ankora</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4A45A]">
              Admin
            </span>
          </div>
        </Link>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute top-[1.25rem] -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[#D4A45A]/20 bg-[#1f0a08] text-[#b8a99e] shadow-sm transition-colors hover:text-[#ddcfc9] cursor-pointer"
        title={collapsed ? "Expandir" : "Colapsar"}
      >
        {collapsed ? <PanelLeft className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.Icon}
              isActive={!!isActive}
              collapsed={collapsed}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative border-t border-[#D4A45A]/[0.12] px-2 py-3 overflow-hidden">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg py-2.5 text-[13px] font-medium text-[#b8a99e] transition-all duration-150 hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9] cursor-pointer",
            collapsed ? "justify-center px-0" : "px-3"
          )}
          title="Cerrar sesión"
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
