-- Add slug column to projects table
ALTER TABLE public.projects
ADD COLUMN slug text;

-- Create unique index on slug (allowing nulls for now)
CREATE UNIQUE INDEX projects_slug_key ON public.projects(slug) WHERE slug IS NOT NULL;

-- Generate unique slugs for existing projects
WITH numbered_projects AS (
  SELECT 
    id,
    project_title,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(project_title, '[^\w\s-]', '', 'g'),
            '\s+', '-', 'g'
          ),
          '-+', '-', 'g'
        )
      )
      ORDER BY created_at
    ) as rn,
    LOWER(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(project_title, '[^\w\s-]', '', 'g'),
          '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
      )
    ) as base_slug
  FROM public.projects
  WHERE slug IS NULL
)
UPDATE public.projects p
SET slug = CASE 
  WHEN np.rn = 1 THEN np.base_slug
  ELSE np.base_slug || '-' || np.rn
END
FROM numbered_projects np
WHERE p.id = np.id;