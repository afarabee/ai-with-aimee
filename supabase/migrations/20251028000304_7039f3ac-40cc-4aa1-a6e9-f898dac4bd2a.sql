-- Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  role TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  body TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_modified TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Draft',
  CONSTRAINT prompts_status_check CHECK (status IN ('Draft', 'Published'))
);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS prompts_title_idx ON public.prompts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS prompts_body_idx ON public.prompts USING gin(to_tsvector('english', body));
CREATE INDEX IF NOT EXISTS prompts_tags_idx ON public.prompts USING gin(tags);
CREATE INDEX IF NOT EXISTS prompts_category_idx ON public.prompts (category);
CREATE INDEX IF NOT EXISTS prompts_role_idx ON public.prompts (role);

-- Create trigger for auto-updating last_modified
CREATE TRIGGER update_prompts_last_modified
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view prompts" 
  ON public.prompts FOR SELECT 
  USING (true);

CREATE POLICY "Allow public to create prompts" 
  ON public.prompts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public to update prompts" 
  ON public.prompts FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public to delete prompts" 
  ON public.prompts FOR DELETE 
  USING (true);

-- Add comments for documentation
COMMENT ON TABLE public.prompts IS 'Stores reusable AI prompt templates for regulated markets';
COMMENT ON COLUMN public.prompts.title IS 'Short, descriptive name for the prompt';
COMMENT ON COLUMN public.prompts.role IS 'Associated persona or use-case (e.g., Product Manager)';
COMMENT ON COLUMN public.prompts.category IS 'High-level category (e.g., PM, Governance, Science)';
COMMENT ON COLUMN public.prompts.tags IS 'Keyword tags for searchability';
COMMENT ON COLUMN public.prompts.body IS 'The actual prompt content';
COMMENT ON COLUMN public.prompts.status IS 'Draft or Published status';

-- Insert sample data for testing
INSERT INTO public.prompts (title, role, category, tags, body, status) VALUES
  (
    'Product Requirements Document Generator',
    'Product Manager',
    'PM',
    ARRAY['PRD', 'documentation', 'requirements'],
    'Create a comprehensive Product Requirements Document for [product name]. Include: 1) Problem statement, 2) User personas, 3) Core features, 4) Success metrics, 5) Technical requirements, 6) Risk assessment.',
    'Published'
  ),
  (
    'Regulatory Compliance Checker',
    'Compliance Officer',
    'Governance',
    ARRAY['compliance', 'regulation', 'audit'],
    'Analyze the following process/product for regulatory compliance: [description]. Check against: FDA guidelines, GDPR requirements, industry-specific regulations. Provide risk levels and mitigation strategies.',
    'Draft'
  ),
  (
    'Scientific Abstract Summarizer',
    'Research Scientist',
    'Science',
    ARRAY['research', 'summary', 'academic'],
    'Summarize this scientific paper in 3 sections: 1) Key findings (2-3 sentences), 2) Methodology (1-2 sentences), 3) Implications for [field]. Paper: [paste abstract or full text]',
    'Published'
  );