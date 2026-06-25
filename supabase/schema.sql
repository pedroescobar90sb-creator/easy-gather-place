-- =====================================================================
-- Pousada Ilha do Meio · Schema PMS (Supabase / PostgreSQL)
-- Execute no SQL Editor do projeto: yqakrtfpdicekxxibsqo
-- =====================================================================

-- =========== EXTENSIONS ===========
create extension if not exists "pgcrypto";
create extension if not exists btree_gist;

-- =========== ENUMS ===========
do $$ begin
  create type app_role            as enum ('admin','operacao');
exception when duplicate_object then null; end $$;

do $$ begin
  create type room_status         as enum ('active','inactive','maintenance','blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type room_type           as enum ('suite','bangalo','standard','master');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reservation_channel as enum ('direto','booking','whatsapp','telefone','site');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reservation_status  as enum ('pending','confirmed','checked_in','checked_out','cancelled','no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status      as enum ('pending','partial','paid','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type block_reason        as enum ('maintenance','owner','blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type audit_severity      as enum ('info','warning','critical');
exception when duplicate_object then null; end $$;

-- =========== USER ROLES ===========
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

-- =========== DOMAIN TABLES ===========
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  type room_type not null,
  capacity int not null check (capacity > 0),
  base_price numeric(10,2) not null check (base_price >= 0),
  status room_status not null default 'active',
  amenities text[] not null default '{}',
  image text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  document text,
  tags text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists guests_email_idx on public.guests (lower(email));
create index if not exists guests_phone_idx on public.guests (phone);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  room_id uuid not null references public.rooms(id) on delete restrict,
  guest_id uuid not null references public.guests(id) on delete restrict,
  check_in  date not null,
  check_out date not null,
  guests int not null check (guests > 0),
  channel reservation_channel not null,
  status reservation_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  total_value numeric(10,2) not null default 0,
  notes text,
  external_ref text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  check (check_out > check_in),
  unique (channel, external_ref)
);
create index if not exists reservations_room_dates_idx on public.reservations (room_id, check_in, check_out);
create index if not exists reservations_status_idx on public.reservations (status);

-- Anti-overbooking real (banco rejeita sobreposição)
alter table public.reservations drop constraint if exists reservations_no_overlap;
alter table public.reservations
  add constraint reservations_no_overlap
  exclude using gist (
    room_id with =,
    daterange(check_in, check_out, '[)') with &&
  ) where (status in ('pending','confirmed','checked_in'));

create table if not exists public.reservation_events (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  at timestamptz not null default now(),
  by_user uuid references auth.users(id),
  action text not null,
  detail text
);

create table if not exists public.room_blocks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  from_date date not null,
  to_date   date not null,
  reason block_reason not null,
  note text,
  created_at timestamptz not null default now(),
  check (to_date > from_date),
  exclude using gist (
    room_id with =,
    daterange(from_date, to_date, '[)') with &&
  )
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  from_date date not null,
  to_date   date not null,
  discount_pct numeric(5,2) not null check (discount_pct between 0 and 100),
  room_ids uuid[] not null default '{}',
  active boolean not null default true,
  conversions int not null default 0,
  revenue numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  target text not null,
  detail text,
  severity audit_severity not null default 'info'
);

create table if not exists public.sync_state (
  channel text primary key,
  status text not null,
  last_sync timestamptz,
  imported_count int not null default 0,
  errors int not null default 0
);

-- =========== GRANTS (Data API) ===========
grant select on public.user_roles to authenticated;
grant all    on public.user_roles to service_role;

grant select, insert, update, delete on
  public.rooms, public.guests, public.reservations, public.reservation_events,
  public.room_blocks, public.promotions, public.audit_logs, public.sync_state
  to authenticated;

grant all on
  public.rooms, public.guests, public.reservations, public.reservation_events,
  public.room_blocks, public.promotions, public.audit_logs, public.sync_state
  to service_role;

grant select on public.rooms to anon;

-- =========== RLS ===========
alter table public.user_roles          enable row level security;
alter table public.rooms               enable row level security;
alter table public.guests              enable row level security;
alter table public.reservations        enable row level security;
alter table public.reservation_events  enable row level security;
alter table public.room_blocks         enable row level security;
alter table public.promotions          enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.sync_state          enable row level security;

drop policy if exists "self read roles"  on public.user_roles;
drop policy if exists "admin manage roles" on public.user_roles;
create policy "self read roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admin manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "rooms public read" on public.rooms;
drop policy if exists "rooms auth read"   on public.rooms;
drop policy if exists "rooms auth write"  on public.rooms;
create policy "rooms public read" on public.rooms for select to anon          using (true);
create policy "rooms auth read"   on public.rooms for select to authenticated using (true);
create policy "rooms auth write"  on public.rooms for all    to authenticated using (true) with check (true);

drop policy if exists "guests rw" on public.guests;
create policy "guests rw" on public.guests for all to authenticated using (true) with check (true);

drop policy if exists "res rw" on public.reservations;
create policy "res rw" on public.reservations for all to authenticated using (true) with check (true);

drop policy if exists "events rw" on public.reservation_events;
create policy "events rw" on public.reservation_events for all to authenticated using (true) with check (true);

drop policy if exists "blocks rw" on public.room_blocks;
create policy "blocks rw" on public.room_blocks for all to authenticated using (true) with check (true);

drop policy if exists "promos rw" on public.promotions;
create policy "promos rw" on public.promotions for all to authenticated using (true) with check (true);

drop policy if exists "audit r" on public.audit_logs;
drop policy if exists "audit i" on public.audit_logs;
create policy "audit r" on public.audit_logs for select to authenticated using (true);
create policy "audit i" on public.audit_logs for insert to authenticated with check (true);

drop policy if exists "sync rw" on public.sync_state;
create policy "sync rw" on public.sync_state for all to authenticated using (true) with check (true);

-- Motor público de reserva
drop policy if exists "public create guest" on public.guests;
create policy "public create guest" on public.guests for insert to anon with check (true);

drop policy if exists "public create reservation" on public.reservations;
create policy "public create reservation" on public.reservations for insert to anon
  with check (status = 'pending' and channel in ('site','direto'));
