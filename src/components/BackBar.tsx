import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

const labels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/calendario": "Calendário",
  "/reservas": "Reservas",
  "/quartos": "Quartos",
  "/hospedes": "Hóspedes",
  "/promocoes": "Promoções",
  "/integracoes": "Integrações",
  "/configuracoes": "Ajustes",
};

export function BackBar() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = labels[pathname] ?? "Voltar";
  const canGoBack = typeof window !== "undefined" && window.history.length > 1;
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: "/dashboard" }))}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground/80 transition hover:bg-accent hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Voltar</span>
        </button>
        {!isDashboard && (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        )}
      </div>
      <div className="truncate text-sm font-medium text-foreground/80">{title}</div>
    </div>
  );
}
