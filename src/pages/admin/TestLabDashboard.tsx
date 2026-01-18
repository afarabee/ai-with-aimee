import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, FlaskConical, Copy, ChevronRight, CheckCircle, Clock, ExternalLink, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import TestScoringModal from '@/components/admin/TestScoringModal';
import { parseMarkdownContent } from '@/utils/markdownParser';

interface Prompt {
  id: string;
  title: string;
  category: string | null;
  body: string;
}

interface Model {
  id: string;
  name: string;
  provider: string;
  url: string | null;
}

interface TestResult {
  id: string;
  test_id: string;
  model_id: string;
  accuracy_score: number | null;
  speed_score: number | null;
  speed_label: string | null;
  style_score: number | null;
  practical_guidance_score: number | null;
  technical_detail_score: number | null;
  x_factor_score: number | null;
  notes: string | null;
  scored_at: string | null;
}

interface Test {
  id: string;
  prompt_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  prompt?: Prompt;
  test_results?: TestResult[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'General Purpose': { bg: 'hsl(var(--color-cyan) / 0.15)', text: 'hsl(var(--color-cyan))', border: 'hsl(var(--color-cyan) / 0.5)' },
  'Deep Reasoning': { bg: 'hsl(280 100% 50% / 0.15)', text: 'hsl(280 100% 70%)', border: 'hsl(280 100% 50% / 0.5)' },
  'Research': { bg: 'hsl(200 100% 50% / 0.15)', text: 'hsl(200 100% 70%)', border: 'hsl(200 100% 50% / 0.5)' },
  'Writing': { bg: 'hsl(var(--color-pink) / 0.15)', text: 'hsl(var(--color-pink))', border: 'hsl(var(--color-pink) / 0.5)' },
  'Coding': { bg: 'hsl(120 100% 40% / 0.15)', text: 'hsl(120 100% 60%)', border: 'hsl(120 100% 40% / 0.5)' },
  'Multi-Modal': { bg: 'hsl(var(--color-yellow) / 0.15)', text: 'hsl(var(--color-yellow))', border: 'hsl(var(--color-yellow) / 0.5)' },
  'Other': { bg: 'hsl(0 0% 50% / 0.15)', text: 'hsl(0 0% 70%)', border: 'hsl(0 0% 50% / 0.5)' },
};

export default function TestLabDashboard() {
  const queryClient = useQueryClient();
  const [isNewTestOpen, setIsNewTestOpen] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [deleteTest, setDeleteTest] = useState<{ id: string; title: string } | null>(null);
  const [viewingTest, setViewingTest] = useState<Test | null>(null);
  const [scoringResult, setScoringResult] = useState<{ testResult: TestResult; model: Model; test: Test } | null>(null);
  const [addModelsTest, setAddModelsTest] = useState<Test | null>(null);
  const [editedPromptBody, setEditedPromptBody] = useState<string>('');

  // Initialize edited prompt when viewing test changes
  useEffect(() => {
    if (viewingTest?.prompt?.body) {
      setEditedPromptBody(viewingTest.prompt.body);
    } else {
      setEditedPromptBody('');
    }
  }, [viewingTest]);

  // Fetch all tests with related data
  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select(`
          *,
          prompt:prompts(id, title, category, body),
          test_results(*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Test[];
    },
  });

  // Fetch all prompts
  const { data: prompts } = useQuery({
    queryKey: ['prompts-for-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('id, title, category, body')
        .eq('status', 'Published')
        .order('title');
      if (error) throw error;
      return data as Prompt[];
    },
  });

  // Fetch all models
  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('id, name, provider, url')
        .order('name');
      if (error) throw error;
      return data as Model[];
    },
  });

  // Create test mutation
  const createTestMutation = useMutation({
    mutationFn: async ({ promptId, modelIds }: { promptId: string; modelIds: string[] }) => {
      // Create test
      const { data: test, error: testError } = await supabase
        .from('tests')
        .insert({ prompt_id: promptId })
        .select()
        .single();
      if (testError) throw testError;

      // Create test_results for each model
      const testResults = modelIds.map(modelId => ({
        test_id: test.id,
        model_id: modelId,
      }));
      const { error: resultsError } = await supabase
        .from('test_results')
        .insert(testResults);
      if (resultsError) throw resultsError;

      return test;
    },
    onSuccess: async (createdTest) => {
      // Fetch the full test with prompt and results data
      const { data: fullTest } = await supabase
        .from('tests')
        .select(`*, prompt:prompts(id, title, category, body), test_results(*)`)
        .eq('id', createdTest.id)
        .single();

      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast.success('Test created!');
      setIsNewTestOpen(false);
      setSelectedPromptId('');
      setSelectedModelIds([]);

      // Immediately open in edit mode
      if (fullTest) {
        setViewingTest(fullTest as Test);
      }
    },
    onError: (error) => {
      toast.error('Failed to create test: ' + error.message);
    },
  });

  // Add models to existing test
  const addModelsMutation = useMutation({
    mutationFn: async ({ testId, modelIds }: { testId: string; modelIds: string[] }) => {
      const testResults = modelIds.map(modelId => ({
        test_id: testId,
        model_id: modelId,
      }));
      const { error } = await supabase
        .from('test_results')
        .insert(testResults);
      if (error) throw error;

      // Update test status back to pending if it was complete
      await supabase
        .from('tests')
        .update({ status: 'pending' })
        .eq('id', testId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast.success('Models added to test!');
      setAddModelsTest(null);
      setSelectedModelIds([]);
    },
    onError: (error) => {
      toast.error('Failed to add models: ' + error.message);
    },
  });

  // Delete test mutation
  const deleteTestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast.success('Test deleted!');
      setDeleteTest(null);
    },
    onError: (error) => {
      toast.error('Failed to delete test: ' + error.message);
    },
  });

  const handleCreateTest = () => {
    if (!selectedPromptId || selectedModelIds.length === 0) {
      toast.error('Please select a prompt and at least one model');
      return;
    }
    createTestMutation.mutate({ promptId: selectedPromptId, modelIds: selectedModelIds });
  };

  const handleAddModels = () => {
    if (!addModelsTest || selectedModelIds.length === 0) {
      toast.error('Please select at least one model');
      return;
    }
    addModelsMutation.mutate({ testId: addModelsTest.id, modelIds: selectedModelIds });
  };

  const handleCopyPrompt = (body: string) => {
    navigator.clipboard.writeText(body);
    toast.success('Prompt copied to clipboard!');
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModelIds(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const getCategoryColor = (category: string | null) => {
    return CATEGORY_COLORS[category || 'Other'] || CATEGORY_COLORS['Other'];
  };

  const getModelById = (modelId: string) => models?.find(m => m.id === modelId);

  const getExistingModelIds = (test: Test | null) => {
    return test?.test_results?.map(tr => tr.model_id) || [];
  };

  // Group prompts by category
  const promptsByCategory = prompts?.reduce((acc, prompt) => {
    const cat = prompt.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prompt);
    return acc;
  }, {} as Record<string, Prompt[]>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-rajdhani font-bold neon-text-cyan">Test Lab</h1>
          <p className="text-[hsl(var(--color-light-text))] opacity-70 mt-1">
            Run prompts against your models and log the results
          </p>
        </div>
        <Button
          onClick={() => setIsNewTestOpen(true)}
          className="btn-hero gap-2"
        >
          <Plus className="h-4 w-4" />
          Start a New Test
        </Button>
      </div>

      {/* Tests Grid */}
      {testsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse" style={{ background: 'rgba(26, 11, 46, 0.6)', border: '1px solid hsl(var(--color-cyan) / 0.2)' }}>
              <div className="h-6 bg-cyan-500/20 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-cyan-500/20 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      ) : tests?.length === 0 ? (
        <Card className="p-12 text-center" style={{ background: 'rgba(26, 11, 46, 0.6)', border: '1px solid hsl(var(--color-cyan) / 0.2)' }}>
          <FlaskConical className="h-16 w-16 mx-auto mb-4 text-[hsl(var(--color-cyan))] opacity-50" />
          <h3 className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))] mb-2">No Tests Yet</h3>
          <p className="text-[hsl(var(--color-light-text))] opacity-70 mb-4">
            Start your first test to compare AI models
          </p>
          <Button onClick={() => setIsNewTestOpen(true)} className="btn-hero gap-2">
            <Plus className="h-4 w-4" />
            Start Your First Test
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests?.map((test) => {
            const categoryColor = getCategoryColor(test.prompt?.category);
            const scoredCount = test.test_results?.filter(tr => tr.scored_at).length || 0;
            const totalCount = test.test_results?.length || 0;

            return (
              <Card
                key={test.id}
                className="p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] cursor-pointer"
                style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  border: '1px solid hsl(var(--color-cyan) / 0.3)',
                }}
                onClick={() => setViewingTest(test)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-rajdhani font-bold text-[hsl(var(--color-cyan))] mb-1">
                      {test.prompt?.title || 'Untitled'}
                    </h3>
                    {test.prompt?.body && (
                      <p className="text-xs text-[hsl(var(--color-light-text))] opacity-70 mb-2 line-clamp-2">
                        {test.prompt.body.length > 120 
                          ? test.prompt.body.substring(0, 120) + '...' 
                          : test.prompt.body}
                      </p>
                    )}
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        background: 'hsl(var(--color-pink) / 0.15)',
                        color: 'hsl(var(--color-pink))',
                        borderColor: 'hsl(var(--color-pink) / 0.5)',
                      }}
                    >
                      {test.prompt?.category || 'Other'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.status === 'complete' ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTest({ id: test.id, title: test.prompt?.title || 'test' });
                      }}
                      className="h-8 w-8 text-[hsl(var(--color-pink))] hover:bg-pink-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {test.test_results?.slice(0, 5).map((tr) => {
                    const model = getModelById(tr.model_id);
                    return (
                      <Badge
                        key={tr.id}
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: tr.scored_at ? 'hsl(var(--color-cyan) / 0.7)' : 'hsl(var(--color-light-text) / 0.3)',
                          color: tr.scored_at ? 'hsl(var(--color-cyan))' : 'hsl(var(--color-light-text))',
                          background: tr.scored_at ? 'hsl(var(--color-cyan) / 0.1)' : 'transparent',
                        }}
                      >
                        {model?.name || 'Unknown'}
                      </Badge>
                    );
                  })}
                  {(test.test_results?.length || 0) > 5 && (
                    <Badge variant="outline" className="text-xs opacity-50">
                      +{(test.test_results?.length || 0) - 5} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-[hsl(var(--color-light-text))] opacity-50">
                    {format(new Date(test.created_at), 'MMM d, yyyy')} • {scoredCount}/{totalCount} scored
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddModelsTest(test);
                      setSelectedModelIds([]);
                    }}
                    className="text-xs text-[hsl(var(--color-pink))] hover:bg-pink-500/10"
                  >
                    + Test More Models
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Test Modal */}
      <Dialog open={isNewTestOpen} onOpenChange={setIsNewTestOpen}>
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] overflow-y-auto"
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-cyan) / 0.4)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
              Start a New Test
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[hsl(var(--color-cyan))]">Select Prompt</Label>
              <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
                <SelectTrigger className="bg-[hsl(var(--color-violet))] border-cyan-500/30 text-[hsl(var(--color-light-text))]">
                  <SelectValue placeholder="Choose a prompt..." />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--color-violet))] border-cyan-500/30 max-h-60">
                  {Object.entries(promptsByCategory).map(([category, categoryPrompts]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-xs font-bold text-[hsl(var(--color-pink))] uppercase">
                        {category}
                      </div>
                      {categoryPrompts.map((prompt) => (
                        <SelectItem
                          key={prompt.id}
                          value={prompt.id}
                          className="text-[hsl(var(--color-light-text))]"
                        >
                          {prompt.title}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[hsl(var(--color-cyan))]">Select Models</Label>
              <div className="border border-cyan-500/30 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                {models?.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-cyan-500/10 cursor-pointer"
                    onClick={() => toggleModelSelection(model.id)}
                  >
                    <Checkbox
                      checked={selectedModelIds.includes(model.id)}
                      onCheckedChange={() => toggleModelSelection(model.id)}
                      className="border-cyan-500/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <div>
                      <p className="text-sm text-[hsl(var(--color-light-text))]">{model.name}</p>
                      <p className="text-xs text-[hsl(var(--color-pink))]">{model.provider}</p>
                    </div>
                  </div>
                ))}
                {models?.length === 0 && (
                  <p className="text-sm text-[hsl(var(--color-light-text))] opacity-50 text-center py-4">
                    No models yet. Add some in My Models first.
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsNewTestOpen(false)}
              className="border-pink-500/50 text-[hsl(var(--color-pink))] hover:bg-pink-500/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTest}
              disabled={createTestMutation.isPending}
              className="btn-hero"
            >
              {createTestMutation.isPending ? 'Creating...' : 'Create Test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Models Modal */}
      <Dialog open={!!addModelsTest} onOpenChange={() => setAddModelsTest(null)}>
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] overflow-y-auto"
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-cyan) / 0.4)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
              Add More Models to Test
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-cyan))]">Select Additional Models</Label>
            <div className="border border-cyan-500/30 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {models?.filter(m => !getExistingModelIds(addModelsTest).includes(m.id)).map((model) => (
                <div
                  key={model.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-cyan-500/10 cursor-pointer"
                  onClick={() => toggleModelSelection(model.id)}
                >
                  <Checkbox
                    checked={selectedModelIds.includes(model.id)}
                    onCheckedChange={() => toggleModelSelection(model.id)}
                    className="border-cyan-500/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <div>
                    <p className="text-sm text-[hsl(var(--color-light-text))]">{model.name}</p>
                    <p className="text-xs text-[hsl(var(--color-pink))]">{model.provider}</p>
                  </div>
                </div>
              ))}
              {addModelsTest && models?.filter(m => !getExistingModelIds(addModelsTest).includes(m.id)).length === 0 && (
                <p className="text-sm text-[hsl(var(--color-light-text))] opacity-50 text-center py-4">
                  All models are already in this test.
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setAddModelsTest(null)}
              className="border-pink-500/50 text-[hsl(var(--color-pink))] hover:bg-pink-500/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddModels}
              disabled={addModelsMutation.isPending}
              className="btn-hero"
            >
              {addModelsMutation.isPending ? 'Adding...' : 'Add Models'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Detail View */}
      <Dialog open={!!viewingTest} onOpenChange={() => setViewingTest(null)}>
        <DialogContent
          className="sm:max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto"
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-cyan) / 0.4)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                {viewingTest?.prompt?.title}
              </DialogTitle>
              {viewingTest?.prompt?.category && (
                <Badge
                  style={{
                    background: getCategoryColor(viewingTest.prompt.category).bg,
                    color: getCategoryColor(viewingTest.prompt.category).text,
                    borderColor: getCategoryColor(viewingTest.prompt.category).border,
                  }}
                  variant="outline"
                >
                  {viewingTest.prompt.category}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Prompt Body */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[hsl(var(--color-pink))]">Prompt (editable for this session)</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewingTest?.prompt?.body && setEditedPromptBody(viewingTest.prompt.body)}
                    className="text-xs text-[hsl(var(--color-light-text))] hover:bg-white/10"
                    disabled={editedPromptBody === viewingTest?.prompt?.body}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editedPromptBody && handleCopyPrompt(editedPromptBody)}
                    className="text-xs text-[hsl(var(--color-cyan))] hover:bg-cyan-500/10"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Prompt
                  </Button>
                </div>
              </div>
              <textarea
                value={editedPromptBody}
                onChange={(e) => setEditedPromptBody(e.target.value)}
                className="w-full min-h-[400px] max-h-[500px] p-3 rounded-md text-sm font-mono text-[hsl(var(--color-light-text))] resize-y focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid hsl(var(--color-cyan) / 0.2)',
                }}
                placeholder="Prompt content..."
              />
            </div>

            {/* Models to Score */}
            <div className="space-y-2">
              <Label className="text-[hsl(var(--color-pink))]">Model Results</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {viewingTest?.test_results?.map((tr) => {
                  const model = getModelById(tr.model_id);
                  return (
                    <Card
                      key={tr.id}
                      className="p-4 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                      style={{
                        background: tr.scored_at
                          ? 'rgba(0, 255, 255, 0.05)'
                          : 'rgba(26, 11, 46, 0.4)',
                        border: tr.scored_at
                          ? '1px solid hsl(var(--color-cyan) / 0.5)'
                          : '1px solid hsl(var(--color-light-text) / 0.2)',
                      }}
                      onClick={() => model && viewingTest && setScoringResult({ testResult: tr, model, test: viewingTest })}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                            {model?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-[hsl(var(--color-pink))]">{model?.provider}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {model?.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-[hsl(var(--color-pink))] hover:bg-pink-500/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(model.url!, '_blank');
                              }}
                              title={`Open ${model.name}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          {tr.scored_at ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <span className="text-xs text-[hsl(var(--color-light-text))] opacity-50">
                              Click to score
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-[hsl(var(--color-cyan))]" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Footer with Save Test Button */}
            <div className="flex justify-end pt-4 border-t border-cyan-500/20 mt-4">
              <Button
                onClick={async () => {
                  if (!viewingTest) return;
                  try {
                    // Touch the test's updated_at timestamp to confirm save
                    const { error } = await supabase
                      .from('tests')
                      .update({ updated_at: new Date().toISOString() })
                      .eq('id', viewingTest.id);
                    if (error) throw error;
                    
                    await queryClient.invalidateQueries({ queryKey: ['tests'] });
                    
                    // Refetch fresh data
                    const { data: freshTest } = await supabase
                      .from('tests')
                      .select(`*, prompt:prompts(id, title, category, body), test_results(*)`)
                      .eq('id', viewingTest.id)
                      .maybeSingle();
                    
                    if (freshTest) {
                      setViewingTest(freshTest as Test);
                    }
                    
                    toast.success('Test saved successfully!');
                  } catch (error: any) {
                    toast.error('Failed to save test: ' + error.message);
                  }
                }}
                className="btn-hero gap-2"
              >
                Save Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scoring Modal */}
      {scoringResult && (
        <TestScoringModal
          isOpen={!!scoringResult}
          onClose={() => setScoringResult(null)}
          testResult={scoringResult.testResult}
          model={scoringResult.model}
          test={scoringResult.test}
          promptTitle={scoringResult.test.prompt?.title || ''}
          promptCategory={scoringResult.test.prompt?.category || null}
          onSaved={async () => {
            // Invalidate the query cache
            await queryClient.invalidateQueries({ queryKey: ['tests'] });
            
            // Refetch the current viewing test to get fresh data
            if (viewingTest) {
              const { data: freshTest } = await supabase
                .from('tests')
                .select(`*, prompt:prompts(id, title, category, body), test_results(*)`)
                .eq('id', viewingTest.id)
                .maybeSingle();
              
              if (freshTest) {
                setViewingTest(freshTest as Test);
              }
            }
            
            setScoringResult(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTest} onOpenChange={() => setDeleteTest(null)}>
        <AlertDialogContent
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-pink) / 0.4)',
            boxShadow: '0 0 40px rgba(245, 12, 160, 0.2)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-rajdhani text-[hsl(var(--color-pink))]">
              Delete Test?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--color-light-text))]">
              Are you sure you want to delete the test for <strong className="text-[hsl(var(--color-cyan))]">{deleteTest?.title}</strong>? All results will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-cyan-500/50 text-[hsl(var(--color-cyan))] hover:bg-cyan-500/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTest && deleteTestMutation.mutate(deleteTest.id)}
              className="bg-pink-500/20 border border-pink-500 text-[hsl(var(--color-pink))] hover:bg-pink-500/30"
            >
              {deleteTestMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
