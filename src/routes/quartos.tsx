import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/quartos")({
  head: () => ({ meta: [{ title: "Quartos — Ilha do Meio" }] }),
  component: RoomsPage,
});

function RoomsPage() {
  const { rooms, reservations } = useApp();
  const safeRooms = Array.isArray(rooms) ? rooms.filter((room) => room && typeof room === "object") : [];
  const safeReservations = Array.isArray(reservations) ? reservations.filter((reservation) => reservation && typeof reservation === "object") : [];
  const today = new Date().toISOString().slice(0, 10);

  const occByRoom = (id: string) => {
    const days30 = 30;
    let count = 0;
    for (let i = 0; i < days30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      if (safeReservations.some((r) => r.roomId === id && r.status !== "cancelled" && r.checkIn <= iso && r.checkOut > iso)) count++;
    }
    return Math.round((count / days30) * 100);
  };

  const statusColors: Record<string, string> = {
    active: "bg-success/15 text-success-foreground border-success/40",
    maintenance: "bg-warning/20 border-warning/40",
    inactive: "bg-muted text-muted-foreground",
    blocked: "bg-destructive/15 text-destructive border-destructive/30",
  };
  const statusLabels: Record<string, string> = {
    active: "Ativo",
    maintenance: "Manutenção",
    inactive: "Inativo",
    blocked: "Bloqueado",
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader title="Quartos" description="17 quartos · 42 hóspedes · 10 duplo casal · 3 triplo · 4 quádruplo" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {safeRooms.map((room) => {
          const status = room.status ?? "active";
          const amenities = Array.isArray(room.amenities) ? room.amenities.filter((a) => typeof a === "string" && a.trim()) : [];
          const occ = occByRoom(room.id);
          const isOccupied = safeReservations.some((r) => r.roomId === room.id && r.status !== "cancelled" && r.checkIn <= today && r.checkOut > today);
          return (
            <Card key={room.id} className="overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                {room.image ? (
                  <img src={room.image} alt={room.name ?? "Quarto"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
                <span className={`absolute top-3 right-3 inline-flex px-2 py-0.5 rounded-full text-[10px] border ${statusColors[status] ?? statusColors.active}`}>{statusLabels[status] ?? "Ativo"}</span>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-lg leading-tight">{String(room.name ?? "Quarto")}</div>
                      <div className="text-xs text-muted-foreground">#{String(room.code ?? "—")} · {String(room.type ?? "duplo_casal").replace("_", " ")} · {Number(room.capacity) || 1}p</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg">{(room.basePrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</div>
                      <div className="text-[10px] text-muted-foreground">/noite</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{String(room.description ?? "Quarto confortável com ar-condicionado, TV, frigobar e Wi-Fi.")}</p>
                <div className="flex flex-wrap gap-1">
                  {amenities.slice(0, 3).map((a) => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Ocupação 30d</span>
                    <span className="font-medium">{occ}%</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${occ}%` }} />
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">{isOccupied ? "Ocupado agora" : "Disponível agora"}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
