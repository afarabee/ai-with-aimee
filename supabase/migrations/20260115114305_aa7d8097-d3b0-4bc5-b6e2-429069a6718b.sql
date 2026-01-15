-- Drop both possible triggers to clean up
DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts;
DROP TRIGGER IF EXISTS update_prompts_last_modified ON public.prompts;

-- Recreate the trigger using the correct function
CREATE TRIGGER update_prompts_last_modified
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_last_modified_column();