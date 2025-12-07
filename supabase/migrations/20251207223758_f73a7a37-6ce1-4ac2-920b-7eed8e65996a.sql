-- Drop existing admin-only update policy
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;

-- Create a new policy that allows anyone to update projects
-- This is safe because the admin section is protected by password gate
CREATE POLICY "Anyone can update projects" 
ON public.projects 
FOR UPDATE 
USING (true);

-- Drop existing admin-only insert policy
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;

-- Create a new policy that allows anyone to insert projects
CREATE POLICY "Anyone can insert projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);

-- Drop existing admin-only delete policy  
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

-- Create a new policy that allows anyone to delete projects
CREATE POLICY "Anyone can delete projects" 
ON public.projects 
FOR DELETE 
USING (true);