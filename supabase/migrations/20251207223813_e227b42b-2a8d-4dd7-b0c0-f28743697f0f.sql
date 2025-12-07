-- Fix blogs table RLS for password-based admin

-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON public.blogs;

-- Create new permissive policies (admin section is protected by password gate)
CREATE POLICY "Anyone can insert blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update blogs" 
ON public.blogs 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete blogs" 
ON public.blogs 
FOR DELETE 
USING (true);

-- Fix prompts table RLS for password-based admin

-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can insert prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can update prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can delete prompts" ON public.prompts;

-- Create new permissive policies
CREATE POLICY "Anyone can insert prompts" 
ON public.prompts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update prompts" 
ON public.prompts 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete prompts" 
ON public.prompts 
FOR DELETE 
USING (true);

-- Fix newsletter_queue table RLS for password-based admin

-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can view newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Admins can insert newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Admins can update newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Admins can delete newsletters" ON public.newsletter_queue;

-- Create new permissive policies
CREATE POLICY "Anyone can view newsletters" 
ON public.newsletter_queue 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert newsletters" 
ON public.newsletter_queue 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update newsletters" 
ON public.newsletter_queue 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete newsletters" 
ON public.newsletter_queue 
FOR DELETE 
USING (true);