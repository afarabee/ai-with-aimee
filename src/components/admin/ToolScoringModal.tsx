import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Sparkles, Info, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface ToolTestResult {
  id: string;
  test_id: string;
  tool_id: string;
  model_used_id: string | null;
  workflow_efficiency_score: number | null;
  output_fidelity_score: number | null;
  iteration_quality_score: number | null;
  extra_capabilities_score: number | null;
  x_factor_score: number | null;
  notes: string | null;
  scored_at: string | null;
}

interface Tool {
  id: string;
  name: string;
  provider: string;
}

interface Model {
  id: string;
  name: string;
  provider: string;
}

interface ToolScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolResult: ToolTestResult;
  tool: Tool;
  promptTitle: string;
  promptCategory: string | null;
  onSaved: () => void;
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

const CRITERIA_TOOLTIPS: Record<string, string> = {
  workflowEfficiency: "How smoothly did the tool integrate into your workflow?",
  outputFidelity: "How well did the tool present and format the response?",
  iterationQuality: "How helpful, accurate, and responsive was the AI chatbot?",
  extraCapabilities: "Did the tool add features beyond chat (code execution, file access, etc.)?",
  xFactor: "Did the tool experience surprise you with unexpected quality or frustration?",
};

interface CriteriaLabelProps {
  label: string;
  criteriaKey: string;
  colorClass?: string;
}

function CriteriaLabel({ label, criteriaKey, colorClass = 'text-[hsl(var(--color-cyan))]' }: CriteriaLabelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Label className={colorClass}>{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="opacity-50 hover:opacity-100 transition-opacity">
            <Info className="h-3.5 w-3.5 text-[hsl(var(--color-light-text))]" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs bg-slate-900 border-slate-700">
          <p className="text-sm">{CRITERIA_TOOLTIPS[criteriaKey]}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  icon?: 'star' | 'sparkle';
}

function StarRating({ value, onChange, max = 5, icon = 'star' }: StarRatingProps) {
  const IconComponent = icon === 'sparkle' ? Sparkles : Star;

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="transition-transform hover:scale-110"
        >
          <IconComponent
            className={`h-6 w-6 transition-colors ${
              i < value
                ? icon === 'sparkle'
                  ? 'text-[hsl(var(--color-yellow))] fill-[hsl(var(--color-yellow))]'
                  : 'text-[hsl(var(--color-cyan))] fill-[hsl(var(--color-cyan))]'
                : 'text-[hsl(var(--color-light-text))] opacity-30'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ToolScoringModal({
  isOpen,
  onClose,
  toolResult,
  tool,
  promptTitle,
  promptCategory,
  onSaved,
}: ToolScoringModalProps) {
  const queryClient = useQueryClient();
  const [scores, setScores] = useState({
    modelUsedId: toolResult.model_used_id || '',
    workflowEfficiency: toolResult.workflow_efficiency_score || 0,
    outputFidelity: toolResult.output_fidelity_score || 0,
    iterationQuality: toolResult.iteration_quality_score || 0,
    extraCapabilities: toolResult.extra_capabilities_score || 0,
    xFactor: toolResult.x_factor_score || 0,
    notes: toolResult.notes || '',
  });

  // Fetch models for dropdown
  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('id, name, provider')
        .order('name');
      if (error) throw error;
      return data as Model[];
    },
  });

  // Sync form state when toolResult prop changes
  useEffect(() => {
    setScores({
      modelUsedId: toolResult.model_used_id || '',
      workflowEfficiency: toolResult.workflow_efficiency_score || 0,
      outputFidelity: toolResult.output_fidelity_score || 0,
      iterationQuality: toolResult.iteration_quality_score || 0,
      extraCapabilities: toolResult.extra_capabilities_score || 0,
      xFactor: toolResult.x_factor_score || 0,
      notes: toolResult.notes || '',
    });
  }, [toolResult.id]);

  const categoryColor = CATEGORY_COLORS[promptCategory || 'Other'] || CATEGORY_COLORS['Other'];

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('tool_test_results')
        .update({
          model_used_id: scores.modelUsedId || null,
          workflow_efficiency_score: scores.workflowEfficiency || null,
          output_fidelity_score: scores.outputFidelity || null,
          iteration_quality_score: scores.iterationQuality || null,
          extra_capabilities_score: scores.extraCapabilities || null,
          x_factor_score: scores.xFactor || null,
          notes: scores.notes || null,
          scored_at: new Date().toISOString(),
        })
        .eq('id', toolResult.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Tool scores saved!');
      onSaved();
    },
    onError: (error) => {
      toast.error('Failed to save scores: ' + error.message);
    },
  });

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-pink) / 0.4)',
            boxShadow: '0 0 40px rgba(245, 12, 160, 0.2)',
          }}
        >
          <DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-rajdhani font-bold text-[hsl(var(--color-pink))]">
                  {tool.name}
                </DialogTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-[hsl(var(--color-light-text))] hover:text-[hsl(var(--color-pink))] hover:bg-pink-500/10"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Help
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="left"
                    align="start"
                    className="w-80 bg-slate-900 border-pink-500/30 text-[hsl(var(--color-light-text))]"
                  >
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[hsl(var(--color-pink))]">Tool Scoring Methodology</h4>
                      <p className="text-xs opacity-80">
                        Rate each tool on a 1-5 star scale (except X-Factor) to evaluate the tool experience.
                      </p>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium text-[hsl(var(--color-pink))]">Workflow Efficiency:</span>{' '}
                          How smoothly did the tool integrate into your workflow?
                        </div>
                        <div>
                          <span className="font-medium text-[hsl(var(--color-pink))]">Output Fidelity:</span>{' '}
                          How well did the tool present and format the response?
                        </div>
                        <div>
                          <span className="font-medium text-[hsl(var(--color-pink))]">Iteration Quality:</span>{' '}
                          How helpful, accurate, and responsive was the AI chatbot?
                        </div>
                        <div>
                          <span className="font-medium text-[hsl(var(--color-pink))]">Extra Capabilities:</span>{' '}
                          Did the tool add features beyond chat (code exec, file access)?
                        </div>
                        <div>
                          <span className="font-medium text-[hsl(var(--color-yellow))]">X-Factor:</span>{' '}
                          Bonus 1-3 stars for unexpected delight or frustration.
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-[hsl(var(--color-cyan))]">{tool.provider}</p>
              <div className="flex items-center gap-2">
                <Badge
                  style={{
                    background: categoryColor.bg,
                    color: categoryColor.text,
                    borderColor: categoryColor.border,
                  }}
                  variant="outline"
                >
                  {promptCategory || 'Other'}
                </Badge>
                <span className="text-xs text-[hsl(var(--color-light-text))] opacity-70">
                  {promptTitle}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5">
            {/* Model Used Dropdown */}
            <div className="space-y-2">
              <Label className="text-[hsl(var(--color-pink))]">Model Used (optional)</Label>
              <Select value={scores.modelUsedId} onValueChange={(v) => setScores({ ...scores, modelUsedId: v })}>
                <SelectTrigger className="bg-[hsl(var(--color-violet))] border-pink-500/30 text-[hsl(var(--color-light-text))]">
                  <SelectValue placeholder="Select model used in this tool..." />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--color-violet))] border-pink-500/30 max-h-60">
                  {models?.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="text-[hsl(var(--color-light-text))]"
                    >
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Workflow Efficiency */}
            <div className="space-y-2">
              <CriteriaLabel label="Workflow Efficiency" criteriaKey="workflowEfficiency" colorClass="text-[hsl(var(--color-pink))]" />
              <StarRating value={scores.workflowEfficiency} onChange={(v) => setScores({ ...scores, workflowEfficiency: v })} />
            </div>

            {/* Output Fidelity */}
            <div className="space-y-2">
              <CriteriaLabel label="Output Fidelity" criteriaKey="outputFidelity" colorClass="text-[hsl(var(--color-pink))]" />
              <StarRating value={scores.outputFidelity} onChange={(v) => setScores({ ...scores, outputFidelity: v })} />
            </div>

            {/* Iteration Quality */}
            <div className="space-y-2">
              <CriteriaLabel label="Iteration Quality" criteriaKey="iterationQuality" colorClass="text-[hsl(var(--color-pink))]" />
              <StarRating value={scores.iterationQuality} onChange={(v) => setScores({ ...scores, iterationQuality: v })} />
            </div>

            {/* Extra Capabilities */}
            <div className="space-y-2">
              <CriteriaLabel label="Extra Capabilities" criteriaKey="extraCapabilities" colorClass="text-[hsl(var(--color-pink))]" />
              <StarRating value={scores.extraCapabilities} onChange={(v) => setScores({ ...scores, extraCapabilities: v })} />
            </div>

            {/* X-Factor */}
            <div className="space-y-2">
              <CriteriaLabel label="X-Factor (Optional)" criteriaKey="xFactor" colorClass="text-[hsl(var(--color-yellow))]" />
              <StarRating
                value={scores.xFactor}
                onChange={(v) => setScores({ ...scores, xFactor: v })}
                max={3}
                icon="sparkle"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-[hsl(var(--color-pink))]">Notes</Label>
              <Textarea
                value={scores.notes}
                onChange={(e) => setScores({ ...scores, notes: e.target.value })}
                placeholder="Add observations about this tool's performance..."
                rows={3}
                className="bg-[hsl(var(--color-violet))] border-pink-500/30 text-[hsl(var(--color-light-text))]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-cyan-500/50 text-[hsl(var(--color-cyan))] hover:bg-cyan-500/10"
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="bg-pink-500/20 border border-pink-500 text-[hsl(var(--color-pink))] hover:bg-pink-500/30"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Scores'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
