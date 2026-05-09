
-- Remove overly permissive public policies on newsletter_queue
DROP POLICY IF EXISTS "Anyone can insert newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Anyone can update newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Anyone can delete newsletters" ON public.newsletter_queue;

-- Remove broad authenticated storage policy on blog-images bucket
-- This leaves only the admin-scoped INSERT policy
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
