import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { StatusBadge } from "./reservas";

export const Route = createFileRoute("/reservas/")({
  head: () => ({ meta: [{ title: "Reservas — Ilha do Meio" }] }),
  component: ReservasList,
});

function ReservasList() {
  const { reservations, rooms, guests } = useApp();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [channel, setChannel] = useState<string>("all");

  const filtered = reservations
    .filter((r) => status === "all" || r.status === status)
    .filter((r) => channel === "all" || r.channel === channel)
    .filter((r) => {
      if (!q) return true;
      const g = guests.find((x) => x.id === r.guestId);
      return [r.code, g?.name, g?.email, r.externalRef].filter(Boolean).some((s) => s!.toLowerCase().includes(q.toLowerCase()));
    })
    .sort((a, b) => b.checkIn.localeCompare(a.checkIn));

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader
        title="Reservas"
        description={`${reservations.length} reservas totais · ${reservations.filter((r) => r.status !== "cancelled").length} ativas`}
        actions={<Button asChild><Link to="/reservas/nova"><Plus className="h-4 w-4 mr-1.5" />Nova reserva</Link></Button>}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por código, hóspede, e-mail…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
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
          <option value="direto">Direto</option>
          <option value="site">Site</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="booking">Booking</option>
          <option value="telefone">Telefone</option>
        </select>
      </div>

      <div className="border rounded-lg bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Código</th>
              <th className="text-left px-4 py-3 font-medium">Hóspede</th>
              <th className="text-left px-4 py-3 font-medium">Quarto</th>
              <th className="text-left px-4 py-3 font-medium">Datas</th>
              <th className="text-left px-4 py-3 font-medium">Canal</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const room = rooms.find((x) => x.id === r.roomId);
              const guest = guests.find((g) => g.id === r.guestId);
              return (
                <tr key={r.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3"><Link to="/reservas/$id" params={{ id: r.id }} className="font-mono text-xs text-primary hover:underline">{r.code}</Link></td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{guest?.name}</div>
                    <div className="text-xs text-muted-foreground">{guest?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{room?.name}</td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(r.checkIn).toLocaleDateString("pt-BR")} → {new Date(r.checkOut).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{r.channel}</Badge></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-right font-medium">{r.totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Nenhuma reserva encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
