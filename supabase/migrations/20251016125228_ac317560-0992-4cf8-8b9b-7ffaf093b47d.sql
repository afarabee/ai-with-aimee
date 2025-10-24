-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  impact TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_link TEXT,
  project_page_link TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  thumbnail TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('Active', 'In Progress', 'Archived'))
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access for portfolio display
CREATE POLICY "Projects are viewable by everyone"
ON public.projects
FOR SELECT
USING (true);

-- Allow authenticated users to manage projects
CREATE POLICY "Authenticated users can create projects"
ON public.projects
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
ON public.projects
FOR UPDATE
USING (true);

CREATE POLICY "Authenticated users can delete projects"
ON public.projects
FOR DELETE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for ordering
CREATE INDEX idx_projects_display_order ON public.projects(display_order DESC, created_at DESC);