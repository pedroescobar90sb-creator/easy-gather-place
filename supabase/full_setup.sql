-- =========================================================
-- POUSADA ILHA DO MEIO — SETUP COMPLETO (cole no SQL Editor)
-- Reseta o schema public e cria tudo do zero.
-- =========================================================

-- ---------- 0. RESET LIMPO ----------
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ---------- 1. EXTENSIONS ----------
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ---------- 2. ENUMS ----------
CREATE TYPE app_role        AS ENUM ('admin','operacao');
CREATE TYPE room_type       AS ENUM ('duplo_casal','triplo','quadruplo');
CREATE TYPE room_status     AS ENUM ('active','inactive','maintenance');
CREATE TYPE res_status      AS ENUM ('pending','confirmed','checked_in','checked_out','cancelled','no_show');
CREATE TYPE pay_status      AS ENUM ('pending','partial','paid','refunded');
CREATE TYPE channel         AS ENUM ('site','direto','booking','whatsapp','instagram','telefone','airbnb');
CREATE TYPE block_reason    AS ENUM ('maintenance','owner','hold','other');
CREATE TYPE log_severity    AS ENUM ('info','warning','critical');

-- ---------- 3. UPDATED_AT HELPER ----------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ---------- 4. TABLES ----------

-- ROOMS
CREATE TABLE public.rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  type        room_type NOT NULL,
  capacity    int NOT NULL CHECK (capacity > 0),
  base_price  numeric(10,2) NOT NULL CHECK (base_price >= 0),
  status      room_status NOT NULL DEFAULT 'active',
  amenities   text[] NOT NULL DEFAULT '{}',
  image       text,
  description text,
  floor       int,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rooms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_rooms_upd BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- GUESTS
CREATE TABLE public.guests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text,
  phone      text,
  document   text,
  tags       text[] NOT NULL DEFAULT '{}',
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_guests_upd BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RESERVATIONS
CREATE TABLE public.reservations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text NOT NULL UNIQUE,
  room_id        uuid NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  guest_id       uuid NOT NULL REFERENCES public.guests(id) ON DELETE RESTRICT,
  check_in       date NOT NULL,
  check_out      date NOT NULL,
  guests         int  NOT NULL CHECK (guests > 0),
  channel        channel NOT NULL,
  status         res_status NOT NULL DEFAULT 'pending',
  payment_status pay_status NOT NULL DEFAULT 'pending',
  total_value    numeric(10,2) NOT NULL DEFAULT 0,
  notes          text,
  external_ref   text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT res_dates CHECK (check_out > check_in),
  CONSTRAINT no_overbook EXCLUDE USING gist (
    room_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  ) WHERE (status NOT IN ('cancelled','no_show'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_res_upd BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RESERVATION EVENTS
CREATE TABLE public.reservation_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  at              timestamptz NOT NULL DEFAULT now(),
  by_user         text,
  action          text NOT NULL,
  detail          text
);
GRANT SELECT, INSERT ON public.reservation_events TO authenticated;
GRANT ALL ON public.reservation_events TO service_role;
ALTER TABLE public.reservation_events ENABLE ROW LEVEL SECURITY;

-- ROOM BLOCKS
CREATE TABLE public.room_blocks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  from_date  date NOT NULL,
  to_date    date NOT NULL,
  reason     block_reason NOT NULL DEFAULT 'other',
  note       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (to_date > from_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_blocks TO authenticated;
GRANT ALL ON public.room_blocks TO service_role;
ALTER TABLE public.room_blocks ENABLE ROW LEVEL SECURITY;

-- PROMOTIONS
CREATE TABLE public.promotions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  description  text,
  from_date    date NOT NULL,
  to_date      date NOT NULL,
  discount_pct numeric(5,2) NOT NULL DEFAULT 0,
  room_ids     uuid[] NOT NULL DEFAULT '{}',
  active       boolean NOT NULL DEFAULT true,
  conversions  int NOT NULL DEFAULT 0,
  revenue      numeric(10,2) NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.promotions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotions TO authenticated;
GRANT ALL ON public.promotions TO service_role;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_promo_upd BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  at       timestamptz NOT NULL DEFAULT now(),
  actor    text NOT NULL,
  action   text NOT NULL,
  target   text NOT NULL,
  detail   text,
  severity log_severity NOT NULL DEFAULT 'info'
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- SYNC STATE
CREATE TABLE public.sync_state (
  channel        text PRIMARY KEY,
  status         text NOT NULL DEFAULT 'ok',
  last_sync      timestamptz,
  imported_count int NOT NULL DEFAULT 0,
  errors         int NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE ON public.sync_state TO authenticated;
GRANT ALL ON public.sync_state TO service_role;
ALTER TABLE public.sync_state ENABLE ROW LEVEL SECURITY;

-- USER ROLES (auth gate)
CREATE TABLE public.user_roles (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role     app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text,
  avatar_url text,
  phone      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_upd BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROPERTY SETTINGS
CREATE TABLE public.property_settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  phone      text,
  whatsapp   text,
  instagram  text,
  address    text,
  checkin_time  time DEFAULT '14:00',
  checkout_time time DEFAULT '11:00',
  policies   text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.property_settings TO authenticated;
GRANT ALL ON public.property_settings TO service_role;
ALTER TABLE public.property_settings ENABLE ROW LEVEL SECURITY;

-- ---------- 5. FUNCTIONS ----------

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_staff(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid AND role IN ('admin','operacao'))
$$;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'admin_already_exists';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.create_public_reservation(
  p_name text, p_email text, p_phone text,
  p_room_id uuid, p_check_in date, p_check_out date,
  p_guests int, p_total numeric
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_guest_id uuid; v_res_id uuid; v_code text; v_room public.rooms%ROWTYPE;
BEGIN
  IF length(coalesce(p_name,'')) < 2  OR length(p_name)  > 120 THEN RAISE EXCEPTION 'invalid_name'; END IF;
  IF p_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN RAISE EXCEPTION 'invalid_email'; END IF;
  IF length(coalesce(p_phone,'')) < 8 OR length(p_phone) > 30  THEN RAISE EXCEPTION 'invalid_phone'; END IF;
  IF p_check_in < current_date OR p_check_out <= p_check_in    THEN RAISE EXCEPTION 'invalid_dates'; END IF;
  IF (p_check_out - p_check_in) > 60                            THEN RAISE EXCEPTION 'stay_too_long'; END IF;
  IF p_guests < 1 OR p_guests > 8                               THEN RAISE EXCEPTION 'invalid_guest_count'; END IF;
  IF p_total < 0 OR p_total > 1000000                           THEN RAISE EXCEPTION 'invalid_total'; END IF;

  SELECT * INTO v_room FROM public.rooms WHERE id = p_room_id AND status = 'active';
  IF NOT FOUND THEN RAISE EXCEPTION 'room_unavailable'; END IF;
  IF p_guests > v_room.capacity THEN RAISE EXCEPTION 'over_capacity'; END IF;

  INSERT INTO public.guests (name, email, phone, tags)
  VALUES (trim(p_name), lower(trim(p_email)), trim(p_phone), ARRAY['lead site'])
  RETURNING id INTO v_guest_id;

  v_code := 'SITE-' || to_char(now(),'YYMMDD') || '-' || upper(substr(gen_random_uuid()::text,1,4));

  INSERT INTO public.reservations
    (code, room_id, guest_id, check_in, check_out, guests, channel, status, payment_status, total_value)
  VALUES
    (v_code, p_room_id, v_guest_id, p_check_in, p_check_out, p_guests, 'site', 'pending', 'pending', p_total)
  RETURNING id INTO v_res_id;

  RETURN v_res_id;
END; $$;
REVOKE ALL ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,int,numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,int,numeric) TO anon, authenticated;

-- ---------- 6. RLS POLICIES ----------

-- rooms (catálogo público read; staff escreve)
CREATE POLICY rooms_read_all ON public.rooms FOR SELECT USING (true);
CREATE POLICY rooms_staff_write ON public.rooms FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- guests
CREATE POLICY guests_staff_all ON public.guests FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- reservations
CREATE POLICY res_staff_all ON public.reservations FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- reservation_events
CREATE POLICY events_staff_all ON public.reservation_events FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- room_blocks
CREATE POLICY blocks_staff_all ON public.room_blocks FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- promotions (anon vê só ativas)
CREATE POLICY promo_anon_active ON public.promotions FOR SELECT TO anon USING (active = true);
CREATE POLICY promo_staff_all ON public.promotions FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- audit_logs (staff lê)
CREATE POLICY audit_staff_read ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

-- sync_state
CREATE POLICY sync_staff_all ON public.sync_state FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- user_roles (user vê seus papéis; admin gerencia, sem auto-elevação)
CREATE POLICY roles_self_read ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY roles_admin_insert ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());
CREATE POLICY roles_admin_update ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());
CREATE POLICY roles_admin_delete ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());

-- profiles
CREATE POLICY profiles_self_read ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY profiles_self_insert ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY profiles_self_update ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- property_settings (staff)
CREATE POLICY settings_staff_read ON public.property_settings FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY settings_staff_write ON public.property_settings FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ---------- 7. SEED 17 QUARTOS REAIS ----------
INSERT INTO public.rooms (code, name, type, capacity, base_price, status, amenities, image, description) VALUES
('01','Quarto 01','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e1bba8da-fa5f-4583-8e25-a5314dc681e0/pousada-1.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('02','Quarto 02','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/545be612-10a7-429d-acdb-2a942440c51f/pousada-2.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('03','Quarto 03','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/147f0147-b8fa-4779-8774-35b143d40c4f/pousada-3.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('04','Quarto 04','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/837fc2b3-948f-490e-aad2-3e2e3b77bbb5/pousada-4.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('05','Quarto 05','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e202ce50-fc71-4e0b-8193-40474a16679c/pousada-5.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('06','Quarto 06','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/3ae0bf76-aedc-429e-915b-d68374fa526f/pousada-6.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('07','Quarto 07','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/8de6ec6c-aa60-4f34-b8ce-b5c956fb593a/pousada-7.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('08','Quarto 08','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/2b1a0a0d-3b75-40ef-915c-bd410a9b1d07/pousada-8.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('09','Quarto 09','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/7261bbac-ad5c-4b6b-a0bf-bb57f1d584c8/pousada-9.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('10','Quarto 10','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/584d2128-8f0f-4d72-85a5-c00ac3b6e593/pousada-11.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('11','Quarto 11','triplo',3,550,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e1bba8da-fa5f-4583-8e25-a5314dc681e0/pousada-1.jpg','Quarto triplo com TV, ar-condicionado e frigobar.'),
('12','Quarto 12','triplo',3,550,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/545be612-10a7-429d-acdb-2a942440c51f/pousada-2.jpg','Quarto triplo com TV, ar-condicionado e frigobar.'),
('13','Quarto 13','triplo',3,550,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/147f0147-b8fa-4779-8774-35b143d40c4f/pousada-3.jpg','Quarto triplo com TV, ar-condicionado e frigobar.'),
('14','Quarto 14','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/837fc2b3-948f-490e-aad2-3e2e3b77bbb5/pousada-4.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.'),
('15','Quarto 15','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e202ce50-fc71-4e0b-8193-40474a16679c/pousada-5.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.'),
('16','Quarto 16','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/3ae0bf76-aedc-429e-915b-d68374fa526f/pousada-6.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.'),
('17','Quarto 17','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/8de6ec6c-aa60-4f34-b8ce-b5c956fb593a/pousada-7.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.');

-- ---------- 8. PROPERTY SETTINGS ----------
INSERT INTO public.property_settings (name, phone, whatsapp, instagram, address)
VALUES ('Pousada Ilha do Meio','+557191263096','557191263096','@pousadailhadomeio',
        'Rua Sítio Novo, 7 — Loteamento Santa Maria, Lote 8 — Itacimirim, Camaçari — BA — CEP 42823-000');

-- ---------- 9. SYNC STATE ----------
INSERT INTO public.sync_state (channel, status) VALUES ('booking','ok');

-- =========================================================
-- FIM. Próximo passo: crie sua conta em /auth — você vira admin
-- automaticamente (claim_first_admin é chamado no primeiro signup).
-- =========================================================
