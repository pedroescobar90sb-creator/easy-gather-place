// Manually maintained — mirror of public schema in supabase/schema.sql
export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

type Rooms = {
  Row: {
    id: string;
    code: string;
    name: string;
    type: "suite" | "bangalo" | "standard" | "master";
    capacity: number;
    base_price: number;
    status: "active" | "inactive" | "maintenance" | "blocked";
    amenities: string[];
    image: string | null;
    description: string | null;
    created_at: string;
  };
};

type Guests = {
  Row: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    document: string | null;
    tags: string[];
    notes: string | null;
    created_at: string;
  };
};

type Reservations = {
  Row: {
    id: string;
    code: string;
    room_id: string;
    guest_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    channel: "direto" | "booking" | "whatsapp" | "telefone" | "site";
    status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show";
    payment_status: "pending" | "partial" | "paid" | "refunded";
    total_value: number;
    notes: string | null;
    external_ref: string | null;
    created_by: string | null;
    created_at: string;
  };
};

type ReservationEvents = {
  Row: {
    id: string;
    reservation_id: string;
    at: string;
    by_user: string | null;
    action: string;
    detail: string | null;
  };
};

type RoomBlocks = {
  Row: {
    id: string;
    room_id: string;
    from_date: string;
    to_date: string;
    reason: "maintenance" | "owner" | "blocked";
    note: string | null;
    created_at: string;
  };
};

type Promotions = {
  Row: {
    id: string;
    name: string;
    description: string | null;
    from_date: string;
    to_date: string;
    discount_pct: number;
    room_ids: string[];
    active: boolean;
    conversions: number;
    revenue: number;
    created_at: string;
  };
};

type AuditLogs = {
  Row: {
    id: string;
    at: string;
    actor: string;
    action: string;
    target: string;
    detail: string | null;
    severity: "info" | "warning" | "critical";
  };
};

type SyncStateT = {
  Row: {
    channel: string;
    status: string;
    last_sync: string | null;
    imported_count: number;
    errors: number;
  };
};

type Table<T extends { Row: Record<string, unknown> }> = {
  Row: T["Row"];
  Insert: Partial<T["Row"]>;
  Update: Partial<T["Row"]>;
};

export interface Database {
  public: {
    Tables: {
      rooms: Table<Rooms>;
      guests: Table<Guests>;
      reservations: Table<Reservations>;
      reservation_events: Table<ReservationEvents>;
      room_blocks: Table<RoomBlocks>;
      promotions: Table<Promotions>;
      audit_logs: Table<AuditLogs>;
      sync_state: Table<SyncStateT>;
      user_roles: Table<{
        Row: { id: string; user_id: string; role: "admin" | "operacao"; created_at: string };
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      has_role: { Args: { _user_id: string; _role: "admin" | "operacao" }; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}
