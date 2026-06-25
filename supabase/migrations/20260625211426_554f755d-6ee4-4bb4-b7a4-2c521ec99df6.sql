REVOKE ALL ON FUNCTION public.public_busy_room_ids(date, date) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,integer,numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_busy_room_ids(date, date) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_public_reservation(text,text,text,uuid,date,date,integer,numeric) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated, service_role;