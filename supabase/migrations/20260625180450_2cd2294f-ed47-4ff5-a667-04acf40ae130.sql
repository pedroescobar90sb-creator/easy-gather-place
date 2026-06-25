
-- 1. Novos tipos de quarto
ALTER TYPE room_type ADD VALUE IF NOT EXISTS 'duplo_casal';
ALTER TYPE room_type ADD VALUE IF NOT EXISTS 'triplo';
ALTER TYPE room_type ADD VALUE IF NOT EXISTS 'quadruplo';

-- 2. Campo "andar" em rooms
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS floor smallint;

-- 3. Configurações da pousada
CREATE TABLE IF NOT EXISTS public.property_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Pousada Ilha do Meio',
  phone text,
  address text,
  check_in time NOT NULL DEFAULT '14:00',
  check_out time NOT NULL DEFAULT '11:00',
  cancellation_policy text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_settings TO authenticated;
GRANT ALL ON public.property_settings TO service_role;
ALTER TABLE public.property_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read property_settings" ON public.property_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write property_settings" ON public.property_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.property_settings (name, phone, address, cancellation_policy)
SELECT 'Pousada Ilha do Meio', '(71) 99999-0000', 'Estrada do Coco, Itacimirim — BA',
       'Cancelamento gratuito até 7 dias antes do check-in. Após esse prazo, retenção de 50%. No-show: 100%.'
WHERE NOT EXISTS (SELECT 1 FROM public.property_settings);

-- 4. Profiles ligado a auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "users upsert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- 5. Anti-overbooking: nenhum quarto pode ter duas reservas ativas em datas sobrepostas
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE public.reservations
  DROP CONSTRAINT IF EXISTS reservations_no_overlap;
ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_no_overlap
  EXCLUDE USING gist (
    room_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  )
  WHERE (status <> 'cancelled');

-- 6. Trigger genérico de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_property_settings_updated ON public.property_settings;
CREATE TRIGGER trg_property_settings_updated BEFORE UPDATE ON public.property_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
