
CREATE OR REPLACE FUNCTION public.public_busy_room_ids(p_check_in date, p_check_out date)
RETURNS TABLE(room_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.room_id FROM public.reservations r
  WHERE r.status IN ('pending','confirmed','checked_in')
    AND r.check_in < p_check_out
    AND r.check_out > p_check_in
  UNION
  SELECT b.room_id FROM public.room_blocks b
  WHERE b.from_date < p_check_out
    AND b.to_date  > p_check_in;
$$;

GRANT EXECUTE ON FUNCTION public.public_busy_room_ids(date, date) TO anon, authenticated;
