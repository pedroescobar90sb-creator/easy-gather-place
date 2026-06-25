-- Enable Realtime for admin sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_blocks;

-- Make sure REPLICA IDENTITY is FULL so payload.old works on updates/deletes
ALTER TABLE public.reservations REPLICA IDENTITY FULL;
ALTER TABLE public.guests REPLICA IDENTITY FULL;
ALTER TABLE public.room_blocks REPLICA IDENTITY FULL;

-- Helpful index for the public availability filter
CREATE INDEX IF NOT EXISTS idx_reservations_dates
  ON public.reservations (room_id, check_in, check_out)
  WHERE status IN ('pending','confirmed','checked_in');
