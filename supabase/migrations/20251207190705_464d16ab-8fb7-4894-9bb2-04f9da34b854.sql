-- Step 1: Create an Enum for Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 2: Set Up the user_roles Table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Step 3: Enable Row-Level Security on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for user_roles (only admins can view/manage roles)
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Step 5: Create a Security Definer Function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 6: Drop existing permissive policies on blogs table
DROP POLICY IF EXISTS "Allow public to create blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public to update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Anyone can view blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can delete blogs" ON public.blogs;

-- Step 7: Create secure RLS policies for blogs
CREATE POLICY "Anyone can view published blogs" ON public.blogs
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert blogs" ON public.blogs
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blogs" ON public.blogs
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blogs" ON public.blogs
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Step 8: Drop existing permissive policies on projects table
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects;

-- Step 9: Create secure RLS policies for projects
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Step 10: Drop existing permissive policies on prompts table
DROP POLICY IF EXISTS "Allow public to create prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow public to update prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow public to delete prompts" ON public.prompts;
DROP POLICY IF EXISTS "Anyone can view prompts" ON public.prompts;

-- Step 11: Create secure RLS policies for prompts
CREATE POLICY "Anyone can view prompts" ON public.prompts
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert prompts" ON public.prompts
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update prompts" ON public.prompts
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete prompts" ON public.prompts
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Step 12: Drop existing permissive policies on newsletter_queue table
DROP POLICY IF EXISTS "Anyone can create newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Anyone can update newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Anyone can delete newsletters" ON public.newsletter_queue;
DROP POLICY IF EXISTS "Anyone can view newsletters" ON public.newsletter_queue;

-- Step 13: Create secure RLS policies for newsletter_queue
CREATE POLICY "Admins can view newsletters" ON public.newsletter_queue
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert newsletters" ON public.newsletter_queue
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update newsletters" ON public.newsletter_queue
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete newsletters" ON public.newsletter_queue
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));