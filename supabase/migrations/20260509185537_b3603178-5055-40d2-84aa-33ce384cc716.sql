
-- Remove the public SELECT policy on newsletter_queue that exposed draft newsletters
DROP POLICY IF EXISTS "Anyone can view newsletters" ON public.newsletter_queue;
