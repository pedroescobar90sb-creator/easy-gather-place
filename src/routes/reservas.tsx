import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { ReservationStatus } from "@/lib/types";

export const Route = createFileRoute("/reservas")({
  head: () => ({ meta: [{ title: "Reservas — Ilha do Meio" }] }),
  component: () => <Outlet />,
});

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pendente", cls: "bg-warning/20 text-warning-foreground border-warning/40" },
    confirmed: { label: "Confirmada", cls: "bg-primary/15 text-primary border-primary/30" },
    checked_in: { label: "Check-in", cls: "bg-success/20 text-success-foreground border-success/40" },
    checked_out: { label: "Check-out", cls: "bg-muted text-muted-foreground" },
    cancelled: { label: "Cancelada", cls: "bg-destructive/15 text-destructive border-destructive/30" },
    no_show: { label: "No-show", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  };
  const cfg = map[status] ?? { label: String(status ?? "—"), cls: "bg-muted text-muted-foreground" };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] border ${cfg.cls}`}>{cfg.label}</span>;
}
