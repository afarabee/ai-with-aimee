-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Create a new public delete policy for blog-images bucket
CREATE POLICY "Anyone can delete blog images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'blog-images');