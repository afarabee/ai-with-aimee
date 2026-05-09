
-- ============================================================
-- 1. AUTH CONFIG: trigger to auto-assign admin role
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'aimee.farabee@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();

-- Allow admins to manage user_roles
DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;
CREATE POLICY "Admins can manage user_roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 2. LOCK DOWN WRITES on all public tables
-- ============================================================

-- Helper: drop all open policies and create admin-only writes
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'blogs','projects','prompts','tests','test_results',
    'tools','tool_test_results','models','model_map_insights',
    'why_aimee','newsletter_queue'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Anyone can insert %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Anyone can update %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Anyone can delete %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Anyone can view %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.%1$I', t);
    EXECUTE format($f$CREATE POLICY "Admins can insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'))$f$, t);
    EXECUTE format($f$CREATE POLICY "Admins can update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'))$f$, t);
    EXECUTE format($f$CREATE POLICY "Admins can delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'))$f$, t);
  END LOOP;
END $$;

-- ============================================================
-- 3. SELECT policies: public reads with status filters; admins see all
-- ============================================================

CREATE POLICY "Public can view published blogs" ON public.blogs
FOR SELECT USING (
  (status = 'published' AND deleted_at IS NULL)
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Public can view non-draft projects" ON public.projects
FOR SELECT USING (
  status <> 'Draft'
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Public can view published prompts" ON public.prompts
FOR SELECT USING (
  status = 'Published'
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Public can view published why_aimee" ON public.why_aimee
FOR SELECT USING (
  status = 'published'
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can view newsletter_queue" ON public.newsletter_queue
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- These remain fully public read (non-sensitive aggregate data)
CREATE POLICY "Public can view tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Public can view test_results" ON public.test_results FOR SELECT USING (true);
CREATE POLICY "Public can view tools" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Public can view tool_test_results" ON public.tool_test_results FOR SELECT USING (true);
CREATE POLICY "Public can view models" ON public.models FOR SELECT USING (true);
CREATE POLICY "Public can view model_map_insights" ON public.model_map_insights FOR SELECT USING (true);

-- ============================================================
-- 4. STORAGE: lock down blog-images update/delete to admins
-- ============================================================

DROP POLICY IF EXISTS "Anyone can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can insert blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can insert blog images" ON storage.objects;

CREATE POLICY "Admins can insert blog images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins can update blog images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins can delete blog images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(),'admin'));
