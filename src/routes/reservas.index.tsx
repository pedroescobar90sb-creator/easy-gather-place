import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, RefreshCw, AlertTriangle, Phone, Globe, Calendar as CalendarIcon } from "lucide-react";
import { StatusBadge } from "./reservas";
import { refreshFromSupabase } from "@/lib/useSupabaseBootstrap";
import { hasOverlap, nightsBetween } from "@/lib/reservations";
import { toast } from "sonner";

export const Route = createFileRoute("/reservas/")({
  head: () => ({ meta: [{ title: "Reservas — Ilha do Meio" }] }),
  component: ReservasList,
});

function ReservasList() {
  const { reservations, rooms, guests, session } = useApp();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [channel, setChannel] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const doRefresh = async (silent = false) => {
    setRefreshing(true);
    try {
      await refreshFromSupabase(session.authenticated);
      setLastSync(new Date());
      if (!silent) toast.success("Reservas atualizadas");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void doRefresh(true);
    const t = setInterval(() => void doRefresh(true), 30_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const conflicts = useMemo(() => {
    const active = reservations.filter((r) => r.status !== "cancelled" && r.status !== "no_show");
    const pairs: Array<{ a: typeof active[number]; b: typeof active[number] }> = [];
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        if (active[i].roomId === active[j].roomId &&
            hasOverlap(active[i].checkIn, active[i].checkOut, active[j].checkIn, active[j].checkOut)) {
          pairs.push({ a: active[i], b: active[j] });
        }
      }
    }
    return pairs;
  }, [reservations]);

  const filtered = reservations
    .filter((r) => status === "all" || r.status === status)
    .filter((r) => channel === "all" || r.channel === channel)
    .filter((r) => {
      if (!q) return true;
      const g = guests.find((x) => x.id === r.guestId);
      const ql = q.toLowerCase();
      return [r.code, g?.name, g?.email, g?.phone, r.externalRef]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(ql));
    })
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  const fmtDate = (s: string) =>
    new Date(s + (s.length === 10 ? "T00:00:00" : "")).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const fmtDateTime = (s: string) => {
    try { return new Date(s).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); }
    catch { return s; }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader
        title="Reservas"
        description={`${reservations.length} totais · ${reservations.filter((r) => r.status !== "cancelled").length} ativas · sync ${lastSync.toLocaleTimeString("pt-BR")}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void doRefresh()} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />Atualizar
            </Button>
            <Button asChild><Link to="/reservas/nova"><Plus className="h-4 w-4 mr-1.5" />Nova reserva</Link></Button>
          </div>
        }
      />

      {conflicts.length > 0 && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
          <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
            <AlertTriangle className="h-4 w-4" /> {conflicts.length} conflito{conflicts.length > 1 ? "s" : ""} de overbooking detectado{conflicts.length > 1 ? "s" : ""}
          </div>
          <ul className="text-xs space-y-1 text-destructive/90">
            {conflicts.slice(0, 5).map((c, i) => {
              const room = rooms.find((r) => r.id === c.a.roomId);
              return (
                <li key={i}>
                  <strong>{room?.name ?? "Quarto"}:</strong>{" "}
                  <Link to="/reservas/$id" params={{ id: c.a.id }} className="underline">{c.a.code}</Link>
                  {" × "}
                  <Link to="/reservas/$id" params={{ id: c.b.id }} className="underline">{c.b.code}</Link>
                  {" "}({fmtDate(c.a.checkIn)}–{fmtDate(c.a.checkOut)} × {fmtDate(c.b.checkIn)}–{fmtDate(c.b.checkOut)})
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por código, hóspede, e-mail, WhatsApp…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border bg-card px-3 text-sm">
          <option value="all">Todos status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmada</option>
          <option value="checked_in">Check-in</option>
          <option value="checked_out">Check-out</option>
          <option value="cancelled">Cancelada</option>
        </select>
        <select value={channel} onChange={(e) => setChannel(e.target.value)} className="rounded-md border bg-card px-3 text-sm">
          <option value="all">Todos canais</option>
          <option value="site">Site (online)</option>
          <option value="direto">Direto</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="booking">Booking</option>
          <option value="telefone">Telefone</option>
        </select>
      </div>

      <div className="border rounded-lg bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Código / Origem</th>
              <th className="text-left px-4 py-3 font-medium">Hóspede</th>
              <th className="text-left px-4 py-3 font-medium">WhatsApp</th>
              <th className="text-left px-4 py-3 font-medium">Quarto</th>
              <th className="text-left px-4 py-3 font-medium">Check-in → Check-out</th>
              <th className="text-center px-4 py-3 font-medium">Noites</th>
              <th className="text-left px-4 py-3 font-medium">Recebido em</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const room = rooms.find((x) => x.id === r.roomId);
              const guest = guests.find((g) => g.id === r.guestId);
              const nights = nightsBetween(r.checkIn, r.checkOut);
              const isSite = r.channel === "site";
              const firstEvent = r.history?.[0]?.at ?? r.createdAt;
              return (
                <tr key={r.id} className={`border-b hover:bg-muted/30 ${isSite ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3">
                    <Link to="/reservas/$id" params={{ id: r.id }} className="font-mono text-xs text-primary hover:underline block">{r.code}</Link>
                    <Badge variant={isSite ? "default" : "outline"} className="capitalize text-[10px] mt-1 gap-1">
                      {isSite && <Globe className="h-2.5 w-2.5" />}{r.channel}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{guest?.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{guest?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {guest?.phone ? (
                      <a
                        href={`https://wa.me/${guest.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Phone className="h-3 w-3" />{guest.phone}
                      </a>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{room?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{fmtDate(r.checkIn)}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{fmtDate(r.checkOut)}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Check-in 14h · Check-out 12h</div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium tabular-nums">{nights}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDateTime(firstEvent)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{r.totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">Nenhuma reserva encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
