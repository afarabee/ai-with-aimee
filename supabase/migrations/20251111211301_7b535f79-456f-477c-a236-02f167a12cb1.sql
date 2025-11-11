-- Drop the old constraint that uses 'In Progress'
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS valid_status;

-- Add updated constraint matching the UI options
ALTER TABLE public.projects ADD CONSTRAINT valid_status 
  CHECK (status IN ('Draft', 'Active', 'Completed', 'Archived'));