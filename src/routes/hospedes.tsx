import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { refreshFromSupabase } from "@/lib/useSupabaseBootstrap";

export const Route = createFileRoute("/hospedes")({
  head: () => ({ meta: [{ title: "Hóspedes — Ilha do Meio" }] }),
  component: GuestsPage,
});

function GuestsPage() {
  const { guests, reservations, session } = useApp();
  const [q, setQ] = useState("");

  useEffect(() => {
    void refreshFromSupabase(session.authenticated);
  }, [session.authenticated]);

  const realSiteGuestIds = new Set(
    reservations
      .filter((r) => r.channel === "site" && r.status !== "cancelled" && r.status !== "no_show")
      .map((r) => r.guestId),
  );

  const filtered = guests
    .filter((g) => realSiteGuestIds.has(g.id))
    .filter((g) => !q || [g.name, g.email, g.phone].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader title="Hóspedes" description={`${filtered.length} hóspedes reais vindos do site`} />

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome, e-mail, telefone…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">Contato</th>
                <th className="text-left px-4 py-3 font-medium">Tags</th>
                <th className="text-right px-4 py-3 font-medium">Estadias</th>
                <th className="text-right px-4 py-3 font-medium">Total gasto</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => {
                const stays = reservations.filter((r) => r.guestId === g.id && r.channel === "site" && r.status !== "cancelled" && r.status !== "no_show");
                const totalSpent = stays.reduce((s, r) => s + r.totalValue, 0);
                return (
                  <tr key={g.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{g.name}</div>
                      {g.notes && <div className="text-xs text-muted-foreground">{g.notes}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">{g.email}</div>
                      <div className="text-xs text-muted-foreground">{g.phone}</div>
                    </td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{g.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div></td>
                    <td className="px-4 py-3 text-right">{stays.length}</td>
                    <td className="px-4 py-3 text-right font-medium">{totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Nenhum hóspede real vindo do site encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
