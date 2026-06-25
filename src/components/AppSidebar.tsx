import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  BookOpen,
  BedDouble,
  Users,
  Tag,
  Plug,
  Wallet,
  Settings,
  LogOut,
  ScrollText,
} from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "@/lib/store";
import { supabase } from "@/lib/supabase/client";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendario", label: "Calendário", icon: CalendarRange },
  { to: "/reservas", label: "Reservas", icon: BookOpen },
  { to: "/quartos", label: "Quartos", icon: BedDouble },
  { to: "/hospedes", label: "Hóspedes", icon: Users },
  { to: "/promocoes", label: "Promoções", icon: Tag },
  { to: "/integracoes", label: "Integrações", icon: Plug },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/auditoria", label: "Auditoria", icon: ScrollText },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const logout = useApp((s) => s.logout);
  const user = useApp((s) => s.session.user);

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Logo className="h-11 w-11" showText />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() ?? "O"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate capitalize">{user?.name ?? "Operador"}</div>
            <div className="text-[11px] text-sidebar-foreground/60 capitalize">{user?.role ?? "operação"}</div>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); logout(); }}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
