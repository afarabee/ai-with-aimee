-- Update the blog slug to the latest published slug
UPDATE public.blogs
SET slug = 'agents-arent-always-the-answer', updated_at = now()
WHERE slug = 'agents-arent-the-answer';