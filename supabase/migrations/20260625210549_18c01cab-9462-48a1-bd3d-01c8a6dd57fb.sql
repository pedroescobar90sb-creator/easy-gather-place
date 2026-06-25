CREATE OR REPLACE FUNCTION public.create_public_reservation(
  p_name text,
  p_email text,
  p_phone text,
  p_room_id uuid,
  p_check_in date,
  p_check_out date,
  p_guests integer,
  p_total numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_guest_id uuid;
  v_res_id   uuid;
  v_code     text;
  v_room     public.rooms%ROWTYPE;
  v_expected_guests integer;
BEGIN
  IF length(coalesce(trim(p_name),'')) < 2 OR length(trim(p_name)) > 120 THEN RAISE EXCEPTION 'invalid_name'; END IF;
  IF lower(trim(p_email)) !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN RAISE EXCEPTION 'invalid_email'; END IF;
  IF length(coalesce(trim(p_phone),'')) < 8 OR length(trim(p_phone)) > 30 THEN RAISE EXCEPTION 'invalid_phone'; END IF;
  IF p_check_in < current_date OR p_check_out <= p_check_in THEN RAISE EXCEPTION 'invalid_dates'; END IF;
  IF (p_check_out - p_check_in) > 60 THEN RAISE EXCEPTION 'stay_too_long'; END IF;
  IF p_total < 0 OR p_total > 1000000 THEN RAISE EXCEPTION 'invalid_total'; END IF;

  SELECT * INTO v_room FROM public.rooms WHERE id = p_room_id AND status = 'active';
  IF NOT FOUND THEN RAISE EXCEPTION 'room_unavailable'; END IF;

  v_expected_guests := CASE v_room.type
    WHEN 'duplo_casal' THEN 2
    WHEN 'triplo' THEN 3
    WHEN 'quadruplo' THEN 4
    ELSE v_room.capacity
  END;

  IF p_guests <> v_expected_guests THEN RAISE EXCEPTION 'invalid_guest_count'; END IF;
  IF p_guests > v_room.capacity THEN RAISE EXCEPTION 'over_capacity'; END IF;

  INSERT INTO public.guests (name, email, phone, tags)
  VALUES (trim(p_name), lower(trim(p_email)), trim(p_phone), ARRAY['site'])
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

REVOKE ALL ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,integer,numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,integer,numeric) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_busy_room_ids(date, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'reservations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'guests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'room_blocks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.room_blocks;
  END IF;
END $$;