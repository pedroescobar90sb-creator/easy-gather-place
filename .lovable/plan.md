
# Plano — Integração 100% com Supabase (Pousada Ilha do Meio)

Hoje o sistema funciona com `zustand` + `localStorage` (`src/lib/store.ts`) e dados mockados em `src/lib/seed.ts`. Vamos substituir essa camada por Supabase real, mantendo toda a UI já construída (calendário, reservas, quartos, hóspedes, promoções, financeiro, integrações, auditoria, configurações, motor público de reserva).

> Observação importante: o projeto Supabase informado é **externo** (BYO Supabase, não Lovable Cloud). Vou configurá-lo via variáveis `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` e usar o cliente do browser. Operações server-side com `service_role` ficam fora do escopo desta etapa (você precisaria fornecer a service key via secret se quiser jobs/admin).

---

## 1. Configuração do cliente

- Criar `src/integrations/supabase/client.ts` com `createClient` usando:
  - URL: `https://yqakrtfpdicekxxibsqo.supabase.co`
  - Publishable key: `sb_publishable_NvWkgHYN03BTixNNi8_NAw_9zkWVfKi`
- Adicionar `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (a key é pública, pode ficar no código também).
- Gerar `src/integrations/supabase/types.ts` (tipos manuais a partir do schema abaixo, já que não temos CLI no projeto BYO).

## 2. Schema SQL (executar no SQL Editor do Supabase)

```sql
-- ============ ENUMS ============
create type app_role            as enum ('admin','operacao');
create type room_status         as enum ('active','inactive','maintenance','blocked');
create type room_type           as enum ('suite','bangalo','standard','master');
create type reservation_channel as enum ('direto','booking','whatsapp','telefone','site');
create type reservation_status  as enum ('pending','confirmed','checked_in','checked_out','cancelled','no_show');
create type payment_status      as enum ('pending','partial','paid','refunded');
create type block_reason        as enum ('maintenance','owner','blocked');
create type audit_severity      as enum ('info','warning','critical');

-- ============ USER ROLES ============
create table public.user_roles (
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

-- ============ DOMÍNIO ============
create table public.rooms (
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

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  document text,
  tags text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);
create index on public.guests (lower(email));
create index on public.guests (phone);

create table public.reservations (
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
  external_ref text,                                    -- idempotência Booking.com
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  check (check_out > check_in),
  unique (channel, external_ref)
);
create index on public.reservations (room_id, check_in, check_out);
create index on public.reservations (status);

-- Anti-overbooking via EXCLUDE com daterange [check_in, check_out)
create extension if not exists btree_gist;
alter table public.reservations
  add constraint reservations_no_overlap
  exclude using gist (
    room_id with =,
    daterange(check_in, check_out, '[)') with &&
  ) where (status in ('pending','confirmed','checked_in'));

create table public.reservation_events (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  at timestamptz not null default now(),
  by_user uuid references auth.users(id),
  action text not null,
  detail text
);

create table public.room_blocks (
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

create table public.promotions (
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

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  target text not null,
  detail text,
  severity audit_severity not null default 'info'
);

create table public.sync_state (
  channel text primary key,
  status text not null,
  last_sync timestamptz,
  imported_count int not null default 0,
  errors int not null default 0
);

-- ============ GRANTS (obrigatórios para Data API) ============
grant select on public.user_roles to authenticated;
grant all    on public.user_roles to service_role;

grant select, insert, update, delete on public.rooms,
  public.guests, public.reservations, public.reservation_events,
  public.room_blocks, public.promotions, public.audit_logs, public.sync_state
  to authenticated;
grant all on public.rooms, public.guests, public.reservations,
  public.reservation_events, public.room_blocks, public.promotions,
  public.audit_logs, public.sync_state to service_role;

-- Motor público de reserva consulta disponibilidade
grant select on public.rooms to anon;

-- ============ RLS ============
alter table public.user_roles          enable row level security;
alter table public.rooms               enable row level security;
alter table public.guests              enable row level security;
alter table public.reservations        enable row level security;
alter table public.reservation_events  enable row level security;
alter table public.room_blocks         enable row level security;
alter table public.promotions          enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.sync_state          enable row level security;

-- user_roles: usuário lê seu papel; admin gerencia
create policy "self read roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admin manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Rooms: leitura pública (motor de reserva); escrita só autenticado
create policy "rooms public read" on public.rooms for select to anon using (true);
create policy "rooms auth read"   on public.rooms for select to authenticated using (true);
create policy "rooms auth write"  on public.rooms for all    to authenticated
  using (true) with check (true);

-- Demais tabelas: somente autenticado
create policy "guests rw"  on public.guests              for all to authenticated using (true) with check (true);
create policy "res rw"     on public.reservations        for all to authenticated using (true) with check (true);
create policy "events rw"  on public.reservation_events  for all to authenticated using (true) with check (true);
create policy "blocks rw"  on public.room_blocks         for all to authenticated using (true) with check (true);
create policy "promos rw"  on public.promotions          for all to authenticated using (true) with check (true);
create policy "audit r"    on public.audit_logs          for select to authenticated using (true);
create policy "audit i"    on public.audit_logs          for insert to authenticated with check (true);
create policy "sync rw"    on public.sync_state          for all to authenticated using (true) with check (true);

-- Motor público insere reservas (status pending) e cria hóspede
create policy "public create guest"       on public.guests       for insert to anon with check (true);
create policy "public create reservation" on public.reservations for insert to anon
  with check (status = 'pending' and channel in ('site','direto'));
```

> O `EXCLUDE` com `daterange [)` é a **prevenção real de overbooking no banco** — mesmo que duas requisições cheguem ao mesmo tempo, o Postgres rejeita a segunda.

## 3. Refatoração da camada de dados

- Trocar `src/lib/store.ts` por hooks de dados baseados em Supabase + React Query (já presente no stack).
  - `useRooms`, `useReservations(range)`, `useGuests`, `useBlocks`, `usePromotions`, `useAudit`, `useSync`.
  - Mutations: `createReservation`, `updateReservation`, `cancelReservation`, `addBlock`, `upsertPromotion`, etc.
- Tratar erro do `EXCLUDE` (`code 23P01`) traduzindo para mensagem amigável "Conflito de inventário — reserva sobreposta detectada".
- Manter `checkConflict` no front como pré-validação UX, mas a fonte de verdade é o constraint.
- Substituir `useApp().session` por `supabase.auth` (email/senha) — `src/routes/auth.tsx` chamará `signInWithPassword` / `signUp`.
- Adicionar `onAuthStateChange` no `__root.tsx` para invalidar React Query.
- Realtime opcional: assinar `public:reservations` para atualizar calendário ao vivo.

## 4. Seed e usuário inicial

Script SQL separado (executado uma vez) para popular 13 quartos da pousada + alguns hóspedes/reservas de demonstração, equivalentes ao `seed.ts`. Entrego junto.

Criação do primeiro admin:
1. Você cria o usuário em Authentication → Users (ex.: `recepcao@ilhadomeio.com.br`).
2. Rodar:
   ```sql
   insert into public.user_roles(user_id, role)
   values ((select id from auth.users where email='recepcao@ilhadomeio.com.br'), 'admin');
   ```

## 5. Páginas afetadas (todas continuam funcionando com mesma UI)

`/auth`, `/` (dashboard/KPIs), `/calendario`, `/reservas` + detalhe + nova, `/quartos`, `/hospedes`, `/promocoes`, `/integracoes`, `/financeiro`, `/auditoria`, `/configuracoes`, `/reservar` (público).

## 6. Itens fora desta entrega (posso fazer em seguida se quiser)

- Webhook real do Booking.com (precisa de service_role + endpoint público).
- Storage Supabase para fotos dos quartos (hoje uso assets locais).
- Edge functions para envio de e-mail de confirmação.

---

## Detalhes técnicos

- Stack mantida: TanStack Start + React Query + Tailwind v4 + shadcn.
- `src/integrations/supabase/client.ts` usa `createClient<Database>(url, publishableKey, { auth: { persistSession: true, autoRefreshToken: true }})`.
- `src/integrations/supabase/types.ts` escrito à mão (sem CLI), refletindo o schema acima.
- React Query keys: `['rooms']`, `['reservations', from, to]`, etc. Invalidação após cada mutation.
- O motor público (`/reservar`) usa cliente anon → insere `guests` + `reservations(status=pending, channel='site')`.
- Logs de auditoria gravados a cada mutation relevante; conflito detectado pelo constraint dispara log `severity='critical'`.

Confirma que posso seguir com essa estrutura (e que a publishable key acima é a que você quer mesmo usar)?
