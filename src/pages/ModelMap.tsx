import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Brain, Zap, Code, Search, Home, Palette, PenTool, Package, Trophy, Medal, Lightbulb, CheckCircle, XCircle, LayoutGrid, ArrowLeft, BookOpen, Target, Sparkles, BarChart3, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
interface Model {
  id: string;
  name: string;
  provider: string;
}
interface ModelMapInsight {
  id: string;
  category: string;
  winner_model_id: string | null;
  winner_tagline: string | null;
  runner_up_model_id: string | null;
  runner_up_tagline: string | null;
  pro_tip: string | null;
  strengths: string[];
  weaknesses: string[];
  comparison_data: Record<string, unknown>;
  heatmap_data: Record<string, unknown>;
  last_calculated: string;
}
interface TestResult {
  id: string;
  test_id: string;
  model_id: string;
  accuracy_score: number | null;
  speed_score: number | null;
  style_score: number | null;
  practical_guidance_score: number | null;
  technical_detail_score: number | null;
  x_factor_score: number | null;
}
interface Test {
  id: string;
  prompt_id: string;
  status: string;
  prompt?: {
    category: string | null;
    testing_focus: string | null;
    title: string | null;
  };
  test_results?: TestResult[];
}
const CATEGORIES = [{
  id: 'Deep Reasoning',
  label: 'Deep Reasoning',
  icon: Brain
}, {
  id: 'General Purpose',
  label: 'General Purpose',
  icon: Zap
}, {
  id: 'Coding',
  label: 'Coding',
  icon: Code
}, {
  id: 'Research',
  label: 'Research',
  icon: Search
}, {
  id: 'Local / Private',
  label: 'Local / Private',
  icon: Home
}, {
  id: 'Multi-Modal',
  label: 'Multi-Modal',
  icon: Palette
}, {
  id: 'Writing',
  label: 'Writing',
  icon: PenTool
}, {
  id: 'Other',
  label: 'Other',
  icon: Package
}];

// Filter out private categories for public display
const PUBLIC_CATEGORIES = CATEGORIES.filter(cat => !['Local / Private', 'Other'].includes(cat.id));
const CRITERIA = ['Accuracy', 'Speed', 'Style', 'Practical Guidance', 'Technical Detail'];

// Private categories that should not be accessible on public page
const PRIVATE_CATEGORY_IDS = ['Local / Private', 'Other'];
export default function ModelMap() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Guard against URL manipulation - reset to summary if private category is selected
  const safeSelectedCategory = selectedCategory && PRIVATE_CATEGORY_IDS.includes(selectedCategory) ? null : selectedCategory;
  const handleCategorySelect = (categoryId: string) => {
    // Prevent selecting private categories
    if (PRIVATE_CATEGORY_IDS.includes(categoryId)) return;
    setSelectedCategory(categoryId);
  };

  // Fetch all models
  const {
    data: models
  } = useQuery({
    queryKey: ['public-models'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('models').select('id, name, provider');
      if (error) throw error;
      return data as Model[];
    }
  });

  // Fetch insights
  const {
    data: insights
  } = useQuery({
    queryKey: ['public-model-map-insights'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('model_map_insights').select('*');
      if (error) throw error;
      return data as ModelMapInsight[];
    }
  });

  // Fetch completed tests with results
  const {
    data: tests
  } = useQuery({
    queryKey: ['public-completed-tests'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('tests').select(`
          *,
          prompt:prompts(category, testing_focus, title),
          test_results(*)
        `).eq('status', 'complete');
      if (error) throw error;
      return data as Test[];
    }
  });
  const getModelById = (id: string | null) => models?.find(m => m.id === id);
  const currentInsight = insights?.find(i => i.category === safeSelectedCategory);
  const winnerModel = getModelById(currentInsight?.winner_model_id || null);
  const runnerUpModel = getModelById(currentInsight?.runner_up_model_id || null);

  // Find latest update timestamp
  const latestUpdate = insights?.reduce((latest, insight) => {
    const insightDate = new Date(insight.last_calculated);
    return insightDate > latest ? insightDate : latest;
  }, new Date(0));

  // Calculate aggregated scores per model per category
  const categoryTests = tests?.filter(t => t.prompt?.category === safeSelectedCategory) || [];
  const modelScores: Record<string, {
    scores: number[];
    count: number;
    model: Model;
  }> = {};
  categoryTests.forEach(test => {
    test.test_results?.forEach(tr => {
      const model = getModelById(tr.model_id);
      if (!model) return;
      if (!modelScores[tr.model_id]) {
        modelScores[tr.model_id] = {
          scores: [0, 0, 0, 0, 0],
          count: 0,
          model
        };
      }
      const ms = modelScores[tr.model_id];
      ms.count++;
      ms.scores[0] += tr.accuracy_score || 0;
      ms.scores[1] += tr.speed_score || 0;
      ms.scores[2] += tr.style_score || 0;
      ms.scores[3] += tr.practical_guidance_score || 0;
      ms.scores[4] += tr.technical_detail_score || 0;
    });
  });

  // Calculate averages
  const modelAverages = Object.entries(modelScores).map(([modelId, data]) => ({
    modelId,
    model: data.model,
    averages: data.scores.map(s => data.count > 0 ? s / data.count : 0),
    overall: data.count > 0 ? data.scores.reduce((a, b) => a + b, 0) / (data.count * 5) : 0
  })).sort((a, b) => b.overall - a.overall);
  const getHeatmapColor = (score: number) => {
    if (score >= 4) return {
      bg: 'bg-green-500/30',
      text: 'text-green-400',
      label: 'Strong'
    };
    if (score >= 2.5) return {
      bg: 'bg-orange-500/30',
      text: 'text-orange-400',
      label: 'Moderate'
    };
    return {
      bg: 'bg-red-500/30',
      text: 'text-red-400',
      label: 'Low'
    };
  };

  // Total tests completed
  const totalTests = tests?.length || 0;
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-rajdhani font-bold neon-text-cyan mb-4">
              My AI Benchmarks
            </h1>
            <p className="text-[22px] text-[hsl(var(--color-light-text))] opacity-80 max-w-2xl mx-auto mb-4">
              Real-world model and tool rankings based on hands-on testing with prompts I use daily.
            </p>
            <div className="flex items-center justify-center gap-4" style={{ fontSize: '15px' }}>
              <span className="text-[hsl(var(--color-pink))]">
                {totalTests} test{totalTests !== 1 ? 's' : ''} completed
              </span>
              {latestUpdate && latestUpdate.getTime() > 0 && <>
                  <span className="text-[hsl(var(--color-light-text))] opacity-50">•</span>
                  <span className="text-[hsl(var(--color-light-text))] opacity-70">
                    Last updated: {format(latestUpdate, 'MMM d, yyyy')}
                  </span>
                </>}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {!safeSelectedCategory ? <>
              {/* AI Coding Tools Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="h-6 w-6 text-[hsl(var(--color-cyan))]" />
                  <h2 className="text-2xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                    AI Coding Tools
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lovable */}
                  <Card className="p-4" style={{
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '1px solid hsl(270 70% 50% / 0.4)'
                  }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-purple-500/30 flex items-center justify-center">
                        <Code className="h-3 w-3 text-purple-400" />
                      </div>
                      <h3 className="font-rajdhani font-bold text-purple-400">
                        Lovable
                      </h3>
                    </div>
                    <p className="text-base text-[hsl(var(--color-light-text))] opacity-60 italic">
                      Testing in progress...
                    </p>
                  </Card>

                  {/* Cursor */}
                  <Card className="p-4" style={{
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '1px solid hsl(45 100% 50% / 0.4)'
                  }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-amber-500/30 flex items-center justify-center">
                        <Code className="h-3 w-3 text-amber-400" />
                      </div>
                      <h3 className="font-rajdhani font-bold text-amber-400">
                        Cursor
                      </h3>
                    </div>
                    <p className="text-base text-[hsl(var(--color-light-text))] opacity-60 italic">
                      Testing in progress...
                    </p>
                  </Card>

                  {/* Windsurf */}
                  <Card className="p-4" style={{
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '1px solid hsl(var(--color-cyan) / 0.4)'
                  }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-cyan-500/30 flex items-center justify-center">
                        <Code className="h-3 w-3 text-cyan-400" />
                      </div>
                      <h3 className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                        Windsurf
                      </h3>
                    </div>
                    <p className="text-base text-[hsl(var(--color-light-text))] opacity-60 italic">
                      Testing in progress...
                    </p>
                  </Card>
                </div>
              </div>

              {/* Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {PUBLIC_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const insight = insights?.find(i => i.category === cat.id);
              const winner = getModelById(insight?.winner_model_id || null);
              const runnerUp = getModelById(insight?.runner_up_model_id || null);
              const testCount = tests?.filter(t => t.prompt?.category === cat.id).length || 0;
              return <Card key={cat.id} className="p-4 cursor-pointer hover:border-cyan-400 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]" onClick={() => handleCategorySelect(cat.id)} style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-5 w-5 text-[hsl(var(--color-cyan))]" />
                      <h3 className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                        {cat.label}
                      </h3>
                    </div>
                    
                    {winner ? <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-[hsl(var(--color-yellow))]" />
                          <span className="text-base text-[hsl(var(--color-light-text))]">
                            {winner.name}
                          </span>
                        </div>
                        {runnerUp && <div className="flex items-center gap-2">
                            <Medal className="h-4 w-4 text-[hsl(var(--color-pink))]" />
                            <span className="text-base text-[hsl(var(--color-light-text))] opacity-70">
                              {runnerUp.name}
                            </span>
                          </div>}
                      </div> : <p className="text-base text-[hsl(var(--color-light-text))] opacity-50 italic">
                        No data yet
                      </p>}
                    
                    <div className="mt-3 pt-2 border-t border-cyan-500/10">
                      <span className="text-base text-[hsl(var(--color-pink))]">
                        {testCount} test{testCount !== 1 ? 's' : ''} completed
                      </span>
                    </div>
                  </Card>;
            })}
            </div>

            {/* Methodology Section */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-[hsl(var(--color-cyan))]" />
                <h2 className="text-2xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                  Testing Methodology
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1: Prompt Design */}
                <Card className="p-4" style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[hsl(var(--color-cyan))]">1</span>
                    </div>
                    <h3 className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                      Prompt Design
                    </h3>
                  </div>
                  <p className="text-lg text-[hsl(var(--color-light-text))] opacity-80" style={{ lineHeight: '1.6' }}>Each test uses real prompts, categorized by use case (coding, writing, research, etc.).</p>
                </Card>

                {/* Step 2: Multi-Model Testing */}
                <Card className="p-4" style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[hsl(var(--color-cyan))]">2</span>
                    </div>
                    <h3 className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                      Multi-Model Testing
                    </h3>
                  </div>
                  <p className="text-lg text-[hsl(var(--color-light-text))] opacity-80" style={{ lineHeight: '1.6' }}>
                    The same prompt is run across multiple AI models and tools to ensure fair, apples-to-apples comparison.
                  </p>
                </Card>

                {/* Step 3: Scoring */}
                <Card className="p-4" style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[hsl(var(--color-cyan))]">3</span>
                    </div>
                    <h3 className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                      Criteria Scoring
                    </h3>
                  </div>
                  <p className="text-lg text-[hsl(var(--color-light-text))] opacity-80" style={{ lineHeight: '1.6' }}>
                    Models are rated 1-5 on six criteria covering accuracy, performance, and output quality.
                  </p>
                </Card>

                {/* Step 4: AI Analysis */}
                <Card className="p-4" style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[hsl(var(--color-cyan))]">4</span>
                    </div>
                    <h3 className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                      AI Analysis
                    </h3>
                  </div>
                  <p className="text-lg text-[hsl(var(--color-light-text))] opacity-80" style={{ lineHeight: '1.6' }}>
                    Aggregate scores are analyzed to generate rankings, insights, and practical recommendations.
                  </p>
                </Card>

                {/* Card 5: Model Criteria */}
                <Card className="p-4" style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-[hsl(var(--color-pink))]" />
                    <h3 className="font-rajdhani font-bold text-[hsl(var(--color-pink))]">
                      Model Criteria
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Accuracy</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Did it follow instructions?</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Speed</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Response time performance</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Style</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Tone & formatting quality</p>
                    </div>
                  </div>
                </Card>

                {/* Card 6: Output Criteria */}
                <Card className="p-4" style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-[hsl(var(--color-pink))]" />
                    <h3 className="font-rajdhani font-bold text-[hsl(var(--color-pink))]">
                      Output Criteria
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Practical Guidance</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Actionable, usable output</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Technical Detail</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Depth of explanation</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">X-Factor</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Unexpected quality or insight</p>
                    </div>
                  </div>
                </Card>

                {/* Card 7: Tool Criteria */}
                <Card className="p-4" style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.2)'
              }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="h-5 w-5 text-[hsl(var(--color-pink))]" />
                    <h3 className="font-rajdhani font-bold text-[hsl(var(--color-pink))]">
                      Tool Criteria
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Output Fidelity</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Accuracy and quality of generated code</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Iteration Quality</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">How well it handles refinements</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">Extra Capabilities</p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Unique features and integrations</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[hsl(var(--color-cyan))]">X-Factor <span className="text-[hsl(var(--color-light-text))] opacity-50 font-normal">(optional)</span></p>
                      <p className="text-base text-[hsl(var(--color-light-text))] opacity-70">Standout qualities or surprises</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            </> : (/* Category Detail View */
        <div className="space-y-6">
              {/* Back Button */}
              <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="text-[hsl(var(--color-cyan))] hover:bg-cyan-500/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Summary
              </Button>

              {/* Category Header */}
              <div className="flex items-center gap-3">
              {(() => {
              const cat = CATEGORIES.find(c => c.id === safeSelectedCategory);
              const Icon = cat?.icon || LayoutGrid;
              return <>
                      <Icon className="h-8 w-8 text-[hsl(var(--color-cyan))]" />
                      <h2 className="text-2xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                        {cat?.label}
                      </h2>
                    </>;
            })()}
                {currentInsight && <span className="text-xs text-[hsl(var(--color-pink))] ml-auto">
                    Last updated: {format(new Date(currentInsight.last_calculated), 'MMM d, yyyy h:mm a')}
                  </span>}
              </div>

              {/* Top Picks & Best Practices */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Top Picks */}
                <Card className="p-6" style={{
              background: 'rgba(26, 11, 46, 0.6)',
              border: '1px solid hsl(var(--color-cyan) / 0.3)'
            }}>
                  <h3 className="text-sm font-rajdhani font-bold text-[hsl(var(--color-pink))] uppercase tracking-wider mb-4">
                    Current Top Picks
                  </h3>
                  <div className="space-y-4">
                    {winnerModel ? <div className="flex items-start gap-3 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        <Trophy className="h-6 w-6 text-[hsl(var(--color-yellow))] flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                            {winnerModel.name}
                          </p>
                          <p className="text-lg text-[hsl(var(--color-light-text))] opacity-80">
                            {currentInsight?.winner_tagline || winnerModel.provider}
                          </p>
                        </div>
                      </div> : <p className="text-lg text-[hsl(var(--color-light-text))] opacity-50 italic">
                        No winner determined yet.
                      </p>}

                    {runnerUpModel && <div className="flex items-start gap-3 p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
                        <Medal className="h-6 w-6 text-[hsl(var(--color-pink))] flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-rajdhani font-bold text-[hsl(var(--color-pink))]">
                            {runnerUpModel.name}
                          </p>
                          <p className="text-lg text-[hsl(var(--color-light-text))] opacity-80">
                            {currentInsight?.runner_up_tagline || runnerUpModel.provider}
                          </p>
                        </div>
                      </div>}
                  </div>
                </Card>

                {/* Best Practices */}
                <Card className="p-6" style={{
              background: 'rgba(26, 11, 46, 0.6)',
              border: '1px solid hsl(var(--color-cyan) / 0.3)'
            }}>
                  <h3 className="text-sm font-rajdhani font-bold text-[hsl(var(--color-pink))] uppercase tracking-wider mb-4">
                    Best Practices
                  </h3>
                  {currentInsight?.pro_tip ? <div className="p-4 rounded-lg flex gap-3" style={{
                background: 'hsl(var(--color-yellow) / 0.1)',
                border: '1px solid hsl(var(--color-yellow) / 0.3)'
              }}>
                      <Lightbulb className="h-5 w-5 text-[hsl(var(--color-yellow))] flex-shrink-0 mt-0.5" />
                      <p className="text-lg text-[hsl(var(--color-yellow))]">
                        <strong>Pro-Tip:</strong> {currentInsight.pro_tip}
                      </p>
                    </div> : <p className="text-lg text-[hsl(var(--color-light-text))] opacity-50 italic">
                      No insights generated yet.
                    </p>}
                </Card>
              </div>

              {/* Strengths & Weaknesses */}
              {currentInsight && (currentInsight.strengths?.length > 0 || currentInsight.weaknesses?.length > 0) && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <Card className="p-6" style={{
              background: 'rgba(26, 11, 46, 0.6)',
              border: '1px solid hsl(120 100% 40% / 0.3)'
            }}>
                    <h3 className="text-sm font-rajdhani font-bold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {currentInsight.strengths?.map((strength, idx) => <li key={idx} className="text-lg text-[hsl(var(--color-light-text))] flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {strength}
                        </li>)}
                    </ul>
                  </Card>

                  {/* Weaknesses */}
                  <Card className="p-6" style={{
              background: 'rgba(26, 11, 46, 0.6)',
              border: '1px solid hsl(var(--color-pink) / 0.3)'
            }}>
                    <h3 className="text-sm font-rajdhani font-bold text-[hsl(var(--color-pink))] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Weaknesses
                    </h3>
                    <ul className="space-y-2">
                      {currentInsight.weaknesses?.map((weakness, idx) => <li key={idx} className="text-lg text-[hsl(var(--color-light-text))] flex items-start gap-2">
                          <span className="text-[hsl(var(--color-pink))] mt-1">•</span>
                          {weakness}
                        </li>)}
                    </ul>
                  </Card>
                </div>}

              {/* Tests in this Category */}
              {categoryTests.length > 0 && (
                <Card className="p-6" style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  border: '1px solid hsl(var(--color-cyan) / 0.3)'
                }}>
                  <h3 className="text-base font-rajdhani font-bold text-[hsl(var(--color-pink))] uppercase tracking-wider mb-4">
                    Tests Completed
                  </h3>
                  <div className="space-y-3">
                    {categoryTests.map((test) => (
                      <div 
                        key={test.id} 
                        className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20"
                      >
                        <p className="text-base font-rajdhani text-[hsl(var(--color-cyan))]">
                          {test.prompt?.title || 'Untitled Prompt'}
                        </p>
                        {test.prompt?.testing_focus && (
                          <p className="text-base text-[hsl(var(--color-pink))] mt-1">
                            Testing: {test.prompt.testing_focus}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Visual Heatmap */}
              {modelAverages.length > 0 && <Card className="p-6" style={{
            background: 'rgba(26, 11, 46, 0.6)',
            border: '1px solid hsl(var(--color-cyan) / 0.3)'
          }}>
                  <h3 className="text-base font-rajdhani font-bold text-[hsl(var(--color-pink))] uppercase tracking-wider mb-4">
                    Visual Heatmap: Strengths by Criteria
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-base text-[hsl(var(--color-cyan))] font-rajdhani p-4">
                            Model
                          </th>
                          {CRITERIA.map(criterion => <th key={criterion} className="text-center text-base text-[hsl(var(--color-cyan))] font-rajdhani p-4">
                              {criterion}
                            </th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {modelAverages.map(({
                    modelId,
                    model,
                    averages
                  }) => <tr key={modelId} className="border-t border-cyan-500/10">
                            <td className="p-3">
                              <p className="text-lg font-rajdhani text-[hsl(var(--color-light-text))]">
                                {model.name}
                              </p>
                              <p className="text-base text-[hsl(var(--color-pink))]">{model.provider}</p>
                            </td>
                            {averages.map((avg, idx) => {
                      const heatmap = getHeatmapColor(avg);
                      return <td key={idx} className="p-4 text-center">
                                  <div className={`inline-block px-4 py-2 rounded text-base font-medium ${heatmap.bg} ${heatmap.text}`}>
                                    {heatmap.label}
                                  </div>
                                </td>;
                    })}
                          </tr>)}
                      </tbody>
                    </table>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500/30"></div>
                      <span className="text-base text-green-400">Strong (4-5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-orange-500/30"></div>
                      <span className="text-base text-orange-400">Moderate (2.5-4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500/30"></div>
                      <span className="text-base text-red-400">Low (&lt;2.5)</span>
                    </div>
                  </div>
                </Card>}

              {modelAverages.length === 0 && !currentInsight && <Card className="p-12 text-center" style={{
            background: 'rgba(26, 11, 46, 0.6)',
            border: '1px solid hsl(var(--color-cyan) / 0.2)'
          }}>
                  <Brain className="h-16 w-16 mx-auto mb-4 text-[hsl(var(--color-cyan))] opacity-50" />
                  <h3 className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))] mb-2">
                    No Data Yet
                  </h3>
                  <p className="text-[hsl(var(--color-light-text))] opacity-70">
                    Check back soon for insights on this category.
                  </p>
                </Card>}
            </div>)}
        </div>
      </section>

      <Footer />
    </div>;
}