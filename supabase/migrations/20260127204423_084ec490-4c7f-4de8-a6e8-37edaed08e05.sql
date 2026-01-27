ALTER TABLE public.prompts
ADD COLUMN testing_focus text DEFAULT NULL;

COMMENT ON COLUMN public.prompts.testing_focus IS 
  'Short description of what capability this prompt is designed to test';