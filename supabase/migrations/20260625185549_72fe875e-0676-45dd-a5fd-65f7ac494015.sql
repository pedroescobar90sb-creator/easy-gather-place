
CREATE OR REPLACE FUNCTION public.is_staff(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles
    WHERE user_id = _uid AND role IN ('admin','operacao')
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon;
GRANT  EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- guests
DROP POLICY IF EXISTS "guests rw"           ON public.guests;
DROP POLICY IF EXISTS "public create guest" ON public.guests;
REVOKE INSERT, SELECT, UPDATE, DELETE ON public.guests FROM anon;
CREATE POLICY "staff select guests" ON public.guests FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert guests" ON public.guests FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update guests" ON public.guests FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete guests" ON public.guests FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- reservations
DROP POLICY IF EXISTS "res rw"                    ON public.reservations;
DROP POLICY IF EXISTS "public create reservation" ON public.reservations;
REVOKE INSERT, SELECT, UPDATE, DELETE ON public.reservations FROM anon;
CREATE POLICY "staff select reservations" ON public.reservations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert reservations" ON public.reservations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update reservations" ON public.reservations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete reservations" ON public.reservations FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- reservation_events
DROP POLICY IF EXISTS "events rw" ON public.reservation_events;
CREATE POLICY "staff events" ON public.reservation_events FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- room_blocks
DROP POLICY IF EXISTS "blocks rw" ON public.room_blocks;
CREATE POLICY "staff blocks" ON public.room_blocks FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- promotions
DROP POLICY IF EXISTS "promos rw" ON public.promotions;
CREATE POLICY "staff promos"         ON public.promotions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "public active promos" ON public.promotions FOR SELECT TO anon USING (active = true);
GRANT SELECT ON public.promotions TO anon;

-- audit_logs
DROP POLICY IF EXISTS "audit i" ON public.audit_logs;
DROP POLICY IF EXISTS "audit r" ON public.audit_logs;
REVOKE INSERT, UPDATE, DELETE ON public.audit_logs FROM authenticated, anon;
CREATE POLICY "staff read audit" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- sync_state
DROP POLICY IF EXISTS "sync rw" ON public.sync_state;
CREATE POLICY "staff sync" ON public.sync_state FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- rooms
DROP POLICY IF EXISTS "rooms auth write" ON public.rooms;
CREATE POLICY "staff rooms insert" ON public.rooms FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff rooms update" ON public.rooms FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff rooms delete" ON public.rooms FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- property_settings
DROP POLICY IF EXISTS "auth read property_settings" ON public.property_settings;
CREATE POLICY "staff read property_settings" ON public.property_settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- user_roles (prevent self-elevation)
DROP POLICY IF EXISTS "admin manage roles" ON public.user_roles;
CREATE POLICY "admin insert roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') AND user_id <> auth.uid());
CREATE POLICY "admin update roles" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin') AND user_id <> auth.uid());
CREATE POLICY "admin delete roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') AND user_id <> auth.uid());

-- Public booking RPC (only safe path for anon writes)
CREATE OR REPLACE FUNCTION public.create_public_reservation(
  p_name text, p_email text, p_phone text,
  p_room_id uuid, p_check_in date, p_check_out date,
  p_guests int, p_total numeric
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_guest_id uuid;
  v_res_id   uuid;
  v_code     text;
  v_room     public.rooms%ROWTYPE;
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
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,int,numeric) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,int,numeric) TO anon, authenticated;
