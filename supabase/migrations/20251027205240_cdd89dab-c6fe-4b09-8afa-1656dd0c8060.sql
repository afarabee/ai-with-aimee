-- Allow public blog operations for password-protected admin editor
DROP POLICY IF EXISTS "Authenticated users can create blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can update blogs" ON public.blogs;

CREATE POLICY "Allow public to create blogs"
ON public.blogs
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public to update blogs"
ON public.blogs
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

COMMENT ON POLICY "Allow public to create blogs" ON public.blogs IS
'Allows blog creation via anon key. Security handled by PasswordGate component at /admin/blog-editor.';

COMMENT ON POLICY "Allow public to update blogs" ON public.blogs IS
'Allows blog updates via anon key. Security handled by PasswordGate component at /admin/blog-editor.';