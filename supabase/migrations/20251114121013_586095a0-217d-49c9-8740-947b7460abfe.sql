-- Drop the existing restrictive UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;

-- Create a new public UPDATE policy for blog-images bucket
CREATE POLICY "Anyone can update blog images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog-images');