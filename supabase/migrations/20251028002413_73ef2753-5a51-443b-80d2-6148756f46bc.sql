-- Create newsletter_queue table for managing newsletter drafts and scheduled sends
CREATE TABLE IF NOT EXISTS public.newsletter_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'sent')),
  send_type TEXT NOT NULL DEFAULT 'adhoc' CHECK (send_type IN ('adhoc', 'scheduled')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_queue (public access for admin dashboard)
CREATE POLICY "Anyone can view newsletters"
ON public.newsletter_queue
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create newsletters"
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

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_newsletter_queue_updated_at
BEFORE UPDATE ON public.newsletter_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on status for faster filtering
CREATE INDEX idx_newsletter_queue_status ON public.newsletter_queue(status);

-- Create index on scheduled_date for queue processing
CREATE INDEX idx_newsletter_queue_scheduled_date ON public.newsletter_queue(scheduled_date) WHERE status = 'queued';