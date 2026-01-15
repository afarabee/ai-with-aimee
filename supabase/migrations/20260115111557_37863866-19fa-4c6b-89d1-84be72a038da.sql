-- Create a new function for tables using "last_modified" column
CREATE OR REPLACE FUNCTION public.update_last_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.last_modified = now();
  RETURN NEW;
END;
$$;

-- Drop the old trigger and create a new one with the correct function
DROP TRIGGER IF EXISTS update_models_last_modified ON public.models;

CREATE TRIGGER update_models_last_modified
  BEFORE UPDATE ON public.models
  FOR EACH ROW
  EXECUTE FUNCTION update_last_modified_column();