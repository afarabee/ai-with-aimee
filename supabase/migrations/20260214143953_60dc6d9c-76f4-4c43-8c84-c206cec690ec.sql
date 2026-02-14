
CREATE TABLE public.why_aimee (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  hero_tagline text,
  hero_subtext text,
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  vision_title text,
  vision_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  closing_tagline text,
  closing_subtext text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.why_aimee ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view why_aimee" ON public.why_aimee FOR SELECT USING (true);
CREATE POLICY "Anyone can insert why_aimee" ON public.why_aimee FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update why_aimee" ON public.why_aimee FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete why_aimee" ON public.why_aimee FOR DELETE USING (true);

CREATE TRIGGER update_why_aimee_updated_at
  BEFORE UPDATE ON public.why_aimee
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
