export type RoomStatus = "active" | "inactive" | "maintenance" | "blocked";
export type RoomType = "suite" | "bangalo" | "standard" | "master";

export interface Room {
  id: string;
  code: string;
  name: string;
  type: RoomType;
  capacity: number;
  basePrice: number;
  status: RoomStatus;
  amenities: string[];
  image: string;
  description: string;
}

export type Channel = "direto" | "booking" | "whatsapp" | "telefone" | "site";
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";
export type PaymentStatus = "pending" | "partial" | "paid" | "refunded";

export interface Reservation {
  id: string;
  code: string;
  roomId: string;
  guestId: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  guests: number;
  channel: Channel;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  totalValue: number;
  notes?: string;
  externalRef?: string;
  createdAt: string;
  history: ReservationEvent[];
}

export interface ReservationEvent {
  at: string;
  by: string;
  action: string;
  detail?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  document?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
}

export type BlockReason = "maintenance" | "owner" | "blocked";
export interface RoomBlock {
  id: string;
  roomId: string;
  from: string;
  to: string;
  reason: BlockReason;
  note?: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  from: string;
  to: string;
  discountPct: number;
  roomIds: string[];
  active: boolean;
  conversions: number;
  revenue: number;
}

export interface AuditLog {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  detail?: string;
  severity: "info" | "warning" | "critical";
}

export interface SyncState {
  channel: "booking";
  status: "ok" | "syncing" | "error" | "degraded";
  lastSync: string;
  importedCount: number;
  errors: number;
}
