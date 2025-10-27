-- Add soft delete column and performance indexes for blog dashboard

-- Add soft delete column
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz NULL;

-- Add performance index on date_published (descending order for dashboard sorting)
CREATE INDEX IF NOT EXISTS idx_blogs_date_published_desc 
ON public.blogs (date_published DESC);

-- Add partial index on deleted_at for efficient filtering of active blogs
CREATE INDEX IF NOT EXISTS idx_blogs_deleted_at 
ON public.blogs (deleted_at) 
WHERE deleted_at IS NULL;

-- Add comment explaining soft delete column
COMMENT ON COLUMN public.blogs.deleted_at IS 
'Timestamp when blog was soft-deleted. NULL means active. Used for safe deletion without data loss.';