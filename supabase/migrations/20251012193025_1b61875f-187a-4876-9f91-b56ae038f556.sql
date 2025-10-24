-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  date_published TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  banner_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read blogs (public content)
CREATE POLICY "Anyone can view blogs"
ON public.blogs
FOR SELECT
USING (true);

-- Create policy to allow authenticated users to insert blogs
CREATE POLICY "Authenticated users can create blogs"
ON public.blogs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update blogs
CREATE POLICY "Authenticated users can update blogs"
ON public.blogs
FOR UPDATE
TO authenticated
USING (true);

-- Create policy to allow authenticated users to delete blogs
CREATE POLICY "Authenticated users can delete blogs"
ON public.blogs
FOR DELETE
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Create storage policies for blog images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');