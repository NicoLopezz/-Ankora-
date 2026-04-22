"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  PieChart,
  Store,
  ArrowLeftRight,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard, anim: "group-hover/nav:rotate-12" },
  { href: "/dashboard/activos", label: "Mis activos", icon: Coins, anim: "group-hover/nav:scale-110 group-hover/nav:-translate-y-[1px]" },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: PieChart, anim: "group-hover/nav:rotate-[-8deg]" },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: Store, anim: "group-hover/nav:scale-110" },
  { href: "/dashboard/transacciones", label: "Transacciones", icon: ArrowLeftRight, anim: "group-hover/nav:translate-x-[2px]" },
  { href: "/dashboard/perfil", label: "Perfil", icon: User, anim: "group-hover/nav:scale-110" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-[#ddcfc9]/[0.06] bg-[#2a0e0b] transition-all duration-300 md:flex",
        collapsed ? "w-[56px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center overflow-hidden border-b border-[#ddcfc9]/[0.06] px-4">
        <Link href="/dashboard" className="group/logo flex items-center gap-2 min-w-0">
          <span className="h-2.5 w-2.5 rotate-45 rounded-sm bg-[#D4A45A] flex-shrink-0 transition-all duration-500 ease-in-out group-hover/logo:rotate-[135deg]" />
          <span
            className={cn(
              "text-xl font-bold tracking-tight text-[#ddcfc9] whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            Ankora
          </span>
        </Link>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute top-[1.25rem] -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[#ddcfc9]/10 bg-[#2a0e0b] text-[#b8a99e] shadow-sm transition-colors hover:text-[#ddcfc9] cursor-pointer"
        title={collapsed ? "Expandir" : "Colapsar"}
      >
        {collapsed ? <PanelLeft className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group/nav flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-[#D4A45A]/10 text-[#D4A45A]"
                  : "text-[#b8a99e] hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] flex-shrink-0 transition-all duration-300 ease-out",
                  item.anim
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300 overflow-hidden",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Decorative globe above footer */}
      {!collapsed && (
        <div className="pointer-events-none relative h-24 overflow-hidden">
          <div className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 opacity-50 animate-planet-drift">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(212,164,90,0.35) 0%, rgba(212,164,90,0) 60%)",
                filter: "blur(16px)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/globe.svg"
              alt=""
              aria-hidden
              className="relative h-full w-full object-contain"
              style={{
                filter:
                  "drop-shadow(0 10px 24px rgba(0,0,0,0.5)) sepia(0.35) hue-rotate(-10deg) saturate(1.3) brightness(1.1)",
              }}
            />
          </div>
          {/* Fade into footer */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#2a0e0b] to-transparent" />
        </div>
      )}

      {/* Footer */}
      <div className="relative border-t border-[#ddcfc9]/[0.06] px-2 py-3 overflow-hidden">
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
