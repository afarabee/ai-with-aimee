-- Create models table
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on models
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for models
CREATE POLICY "Anyone can view models" ON public.models FOR SELECT USING (true);
CREATE POLICY "Anyone can insert models" ON public.models FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update models" ON public.models FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete models" ON public.models FOR DELETE USING (true);

-- Create trigger for models last_modified
CREATE TRIGGER update_models_last_modified
  BEFORE UPDATE ON public.models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create tests table
CREATE TABLE public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tests
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tests
CREATE POLICY "Anyone can view tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tests" ON public.tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tests" ON public.tests FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tests" ON public.tests FOR DELETE USING (true);

-- Create trigger for tests updated_at
CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON public.tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create test_results table
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  accuracy_score INTEGER CHECK (accuracy_score >= 1 AND accuracy_score <= 5),
  speed_score INTEGER CHECK (speed_score >= 1 AND speed_score <= 5),
  speed_label TEXT CHECK (speed_label IN ('slow', 'medium', 'fast')),
  style_score INTEGER CHECK (style_score >= 1 AND style_score <= 5),
  practical_guidance_score INTEGER CHECK (practical_guidance_score >= 1 AND practical_guidance_score <= 5),
  technical_detail_score INTEGER CHECK (technical_detail_score >= 1 AND technical_detail_score <= 5),
  x_factor_score INTEGER CHECK (x_factor_score >= 1 AND x_factor_score <= 3),
  notes TEXT,
  scored_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on test_results
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for test_results
CREATE POLICY "Anyone can view test_results" ON public.test_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert test_results" ON public.test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update test_results" ON public.test_results FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete test_results" ON public.test_results FOR DELETE USING (true);

-- Create model_map_insights table
CREATE TABLE public.model_map_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  winner_model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  winner_tagline TEXT,
  runner_up_model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  runner_up_tagline TEXT,
  pro_tip TEXT,
  strengths TEXT[] DEFAULT '{}'::text[],
  weaknesses TEXT[] DEFAULT '{}'::text[],
  comparison_data JSONB DEFAULT '{}'::jsonb,
  heatmap_data JSONB DEFAULT '{}'::jsonb,
  last_calculated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on model_map_insights
ALTER TABLE public.model_map_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for model_map_insights
CREATE POLICY "Anyone can view model_map_insights" ON public.model_map_insights FOR SELECT USING (true);
CREATE POLICY "Anyone can insert model_map_insights" ON public.model_map_insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update model_map_insights" ON public.model_map_insights FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete model_map_insights" ON public.model_map_insights FOR DELETE USING (true);