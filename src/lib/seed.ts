import type {
  Reservation,
  Room,
  Guest,
  RoomBlock,
  Promotion,
  AuditLog,
  SyncState,
} from "./types";
import suiteImg from "@/assets/room-suite.jpg";
import bungalowImg from "@/assets/room-bungalow.jpg";
import commonImg from "@/assets/common-area.jpg";

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (base: Date, n: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const baseAmenities = ["TV", "Ar-condicionado", "Frigobar"];

type RoomSeed = Omit<Room, "id" | "code">;

const duploCasal = (n: number): RoomSeed => ({
  name: `Quarto ${String(n).padStart(2, "0")}`,
  type: "duplo_casal",
  capacity: 2,
  basePrice: 450,
  status: "active",
  amenities: baseAmenities,
  image: commonImg,
  description: "Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.",
});

const triplo = (n: number): RoomSeed => ({
  name: `Quarto ${String(n).padStart(2, "0")}`,
  type: "triplo",
  capacity: 3,
  basePrice: 550,
  status: "active",
  amenities: baseAmenities,
  image: bungalowImg,
  description: "Quarto triplo com TV, ar-condicionado e frigobar.",
});

const quadruplo = (n: number): RoomSeed => ({
  name: `Quarto ${String(n).padStart(2, "0")}`,
  type: "quadruplo",
  capacity: 4,
  basePrice: 650,
  status: "active",
  amenities: baseAmenities,
  image: suiteImg,
  description: "Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.",
});

export const seedRooms = (): Room[] => {
  const base: RoomSeed[] = [
    ...Array.from({ length: 10 }, (_, i) => duploCasal(i + 1)),
    ...Array.from({ length: 3 }, (_, i) => triplo(i + 11)),
    ...Array.from({ length: 4 }, (_, i) => quadruplo(i + 14)),
  ];
  return base.map((r, i) => ({
    ...r,
    id: `room-${i + 1}`,
    code: String(101 + i),
  }));
};

const guestNames = [
  ["Mariana Souza", "mariana.souza@email.com", "(11) 98123-4501"],
  ["Pedro Henrique Alves", "pedro.alves@email.com", "(21) 99876-2204"],
  ["Camila Rodrigues", "camila.rod@email.com", "(31) 99234-1188"],
  ["João Vitor Costa", "joao.costa@email.com", "(71) 98412-7765"],
  ["Beatriz Fernandes", "bea.fernandes@email.com", "(11) 98712-3450"],
  ["Lucas Martins", "lucas.martins@email.com", "(48) 99125-7702"],
  ["Patricia Lima", "patricia.lima@email.com", "(11) 97812-3387"],
  ["Rafael Pereira", "rafael.pereira@email.com", "(85) 98412-2210"],
  ["Helena Castro", "helena.castro@email.com", "(31) 98876-4521"],
  ["André Nogueira", "andre.nogueira@email.com", "(11) 99312-7741"],
  ["Sofia Almeida", "sofia.almeida@email.com", "(21) 99821-3344"],
  ["Bruno Tavares", "bruno.tavares@email.com", "(81) 99123-4422"],
];

export const seedGuests = (): Guest[] =>
  guestNames.map(([name, email, phone], i) => ({
    id: `guest-${i + 1}`,
    name,
    email,
    phone,
    document: `${100000000 + i * 7777}`,
    tags: i % 3 === 0 ? ["retorno", "casal"] : i % 3 === 1 ? ["familia"] : ["lead site"],
    notes: i === 0 ? "Prefere quarto silencioso, lua de mel." : undefined,
    createdAt: iso(addDays(today, -60 - i * 3)),
  }));

const channels: Reservation["channel"][] = ["booking", "booking", "booking", "whatsapp", "whatsapp", "instagram", "direto", "site", "telefone"];

export const seedReservations = (rooms: Room[], guests: Guest[]): Reservation[] => {
  const list: Reservation[] = [];
  let n = 0;
  // Distribute reservations over -10 .. +40 days
  const slots: Array<{ roomIdx: number; start: number; nights: number; status: Reservation["status"] }> = [
    { roomIdx: 0, start: -2, nights: 4, status: "checked_in" },
    { roomIdx: 1, start: 0, nights: 3, status: "checked_in" },
    { roomIdx: 2, start: 1, nights: 5, status: "confirmed" },
    { roomIdx: 3, start: 3, nights: 2, status: "confirmed" },
    { roomIdx: 5, start: -1, nights: 3, status: "checked_in" },
    { roomIdx: 6, start: 2, nights: 7, status: "confirmed" },
    { roomIdx: 7, start: 5, nights: 3, status: "confirmed" },
    { roomIdx: 8, start: -3, nights: 5, status: "checked_in" },
    { roomIdx: 9, start: 4, nights: 2, status: "pending" },
    { roomIdx: 10, start: 6, nights: 4, status: "confirmed" },
    { roomIdx: 11, start: 8, nights: 3, status: "confirmed" },
    { roomIdx: 12, start: 0, nights: 6, status: "checked_in" },
    { roomIdx: 0, start: 10, nights: 3, status: "confirmed" },
    { roomIdx: 1, start: 7, nights: 4, status: "confirmed" },
    { roomIdx: 3, start: 12, nights: 5, status: "pending" },
    { roomIdx: 5, start: 9, nights: 2, status: "confirmed" },
    { roomIdx: 7, start: 14, nights: 3, status: "confirmed" },
    { roomIdx: 8, start: 16, nights: 4, status: "confirmed" },
    { roomIdx: 12, start: 18, nights: 5, status: "confirmed" },
    { roomIdx: 6, start: 22, nights: 4, status: "pending" },
    { roomIdx: 2, start: 20, nights: 3, status: "confirmed" },
    { roomIdx: 9, start: 25, nights: 6, status: "confirmed" },
    { roomIdx: 10, start: 28, nights: 3, status: "confirmed" },
    { roomIdx: 11, start: 24, nights: 2, status: "confirmed" },
  ];
  for (const s of slots) {
    const room = rooms[s.roomIdx];
    const guest = guests[n % guests.length];
    const channel = channels[n % channels.length];
    const checkIn = iso(addDays(today, s.start));
    const checkOut = iso(addDays(today, s.start + s.nights));
    const total = room.basePrice * s.nights;
    list.push({
      id: `res-${n + 1}`,
      code: `IDM-${1000 + n}`,
      roomId: room.id,
      guestId: guest.id,
      checkIn,
      checkOut,
      guests: Math.min(room.capacity, 2),
      channel,
      status: s.status,
      paymentStatus: s.status === "checked_in" ? "paid" : s.status === "pending" ? "pending" : "partial",
      totalValue: total,
      notes: n === 1 ? "Solicitou cama extra." : undefined,
      externalRef: channel === "booking" ? `BKG-${938000 + n}` : undefined,
      createdAt: iso(addDays(today, -20 + (n % 15))),
      history: [
        { at: iso(addDays(today, -20 + (n % 15))), by: channel === "direto" ? "operador" : channel, action: "created", detail: `Via ${channel}` },
      ],
    });
    n++;
  }
  return list;
};

export const seedBlocks = (rooms: Room[]): RoomBlock[] => [
  {
    id: "blk-1",
    roomId: rooms[4].id,
    from: iso(addDays(today, -2)),
    to: iso(addDays(today, 6)),
    reason: "maintenance",
    note: "Reforma do banheiro",
  },
];

export const seedPromotions = (rooms: Room[]): Promotion[] => [
  {
    id: "promo-1",
    name: "Reserva Antecipada",
    description: "10% de desconto para reservas feitas com antecedência no canal direto.",
    from: iso(addDays(today, -10)),
    to: iso(addDays(today, 120)),
    discountPct: 10,
    roomIds: rooms.map((r) => r.id),
    active: true,
    conversions: 22,
    revenue: 18900,
  },
  {
    id: "promo-2",
    name: "Domingo a Quinta",
    description: "Tarifa reduzida de domingo a quinta — casal R$400, triplo R$500, quádruplo R$600.",
    from: iso(addDays(today, 0)),
    to: iso(addDays(today, 90)),
    discountPct: 11,
    roomIds: rooms.map((r) => r.id),
    active: true,
    conversions: 17,
    revenue: 13400,
  },
  {
    id: "promo-3",
    name: "Reserva Direta sem Comissão",
    description: "Reservas via WhatsApp ou Instagram da pousada — sem taxa de plataforma.",
    from: iso(addDays(today, -30)),
    to: iso(addDays(today, 180)),
    discountPct: 8,
    roomIds: rooms.map((r) => r.id),
    active: true,
    conversions: 11,
    revenue: 9600,
  },
];

export const seedAudit = (): AuditLog[] => [
  { id: "log-1", at: new Date(Date.now() - 1000 * 60 * 8).toISOString(), actor: "Sistema", action: "Conflito prevenido", target: "Quarto Atobá", detail: "Tentativa de reserva sobreposta via Booking bloqueada", severity: "critical" },
  { id: "log-2", at: new Date(Date.now() - 1000 * 60 * 22).toISOString(), actor: "Booking.com", action: "Reserva importada", target: "IDM-1008", detail: "Sincronização OK", severity: "info" },
  { id: "log-3", at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), actor: "Maria (recepção)", action: "Reserva criada", target: "IDM-1011", detail: "Via WhatsApp", severity: "info" },
  { id: "log-4", at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), actor: "Sistema", action: "Sync parcial", target: "Booking.com", detail: "1 reserva pendente de revisão manual", severity: "warning" },
  { id: "log-5", at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), actor: "Carlos (gerente)", action: "Bloqueio criado", target: "Bangalô Coqueiral 3", detail: "Manutenção 8 dias", severity: "info" },
];

export const seedSync = (): SyncState => ({
  channel: "booking",
  status: "ok",
  lastSync: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
  importedCount: 47,
  errors: 0,
});
