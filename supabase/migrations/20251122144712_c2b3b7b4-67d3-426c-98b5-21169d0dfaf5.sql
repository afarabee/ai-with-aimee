-- Update projects table status constraint
-- First, drop existing constraint if it exists
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add new constraint with only Draft, Active, and Archived
ALTER TABLE public.projects ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('Draft', 'Active', 'Archived'));

-- Update any existing 'Completed' status to 'Archived'
UPDATE public.projects SET status = 'Archived' WHERE status = 'Completed';

-- Ensure blogs table can handle archived status (already flexible, but for documentation)
-- The blogs.status field is text without constraints, so 'archived' is already supported