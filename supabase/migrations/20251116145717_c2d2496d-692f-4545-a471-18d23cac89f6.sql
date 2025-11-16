-- Add new columns to projects table
ALTER TABLE public.projects 
ADD COLUMN body text NOT NULL DEFAULT '',
ADD COLUMN date_published timestamp with time zone NOT NULL DEFAULT now();

-- Migrate existing data from challenge/solution/impact into body field
UPDATE public.projects 
SET body = CONCAT(
  '## Challenge', E'\n\n', challenge, E'\n\n',
  '## Solution', E'\n\n', solution, E'\n\n', 
  '## Impact', E'\n\n', impact
),
date_published = COALESCE(updated_at, created_at)
WHERE body = '';

-- Drop old columns
ALTER TABLE public.projects 
DROP COLUMN challenge,
DROP COLUMN solution,
DROP COLUMN impact;