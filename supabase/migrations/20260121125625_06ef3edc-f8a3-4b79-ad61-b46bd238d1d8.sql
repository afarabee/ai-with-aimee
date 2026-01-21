-- Create tools table
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT,
  url TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tools
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- RLS policies for tools (same as models - open for demo)
CREATE POLICY "Anyone can view tools" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tools" ON public.tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tools" ON public.tools FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tools" ON public.tools FOR DELETE USING (true);

-- Create trigger for last_modified
CREATE TRIGGER update_tools_last_modified
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_last_modified_column();

-- Create tool_test_results table
CREATE TABLE public.tool_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  model_used_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  workflow_efficiency_score INTEGER,
  output_fidelity_score INTEGER,
  iteration_quality_score INTEGER,
  extra_capabilities_score INTEGER,
  x_factor_score INTEGER,
  notes TEXT,
  scored_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tool_test_results
ALTER TABLE public.tool_test_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for tool_test_results
CREATE POLICY "Anyone can view tool_test_results" ON public.tool_test_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tool_test_results" ON public.tool_test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tool_test_results" ON public.tool_test_results FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tool_test_results" ON public.tool_test_results FOR DELETE USING (true);