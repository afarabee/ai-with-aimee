import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';

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

interface Model {
  id: string;
  name: string;
  provider: string;
}

interface Test {
  id: string;
  prompt_id: string;
  status: string;
  test_results?: TestResult[];
}

interface TestScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  testResult: TestResult;
  model: Model;
  test: Test;
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

export default function TestScoringModal({
  isOpen,
  onClose,
  testResult,
  model,
  test,
  promptTitle,
  promptCategory,
  onSaved,
}: TestScoringModalProps) {
  const queryClient = useQueryClient();
  const [scores, setScores] = useState({
    accuracy: testResult.accuracy_score || 0,
    speed: testResult.speed_score || 0,
    speedLabel: testResult.speed_label || 'medium',
    style: testResult.style_score || 0,
    practicalGuidance: testResult.practical_guidance_score || 0,
    technicalDetail: testResult.technical_detail_score || 0,
    xFactor: testResult.x_factor_score || 0,
    notes: testResult.notes || '',
  });

  const categoryColor = CATEGORY_COLORS[promptCategory || 'Other'] || CATEGORY_COLORS['Other'];

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Update the test result
      const { error: resultError } = await supabase
        .from('test_results')
        .update({
          accuracy_score: scores.accuracy || null,
          speed_score: scores.speed || null,
          speed_label: scores.speedLabel,
          style_score: scores.style || null,
          practical_guidance_score: scores.practicalGuidance || null,
          technical_detail_score: scores.technicalDetail || null,
          x_factor_score: scores.xFactor || null,
          notes: scores.notes || null,
          scored_at: new Date().toISOString(),
        })
        .eq('id', testResult.id);

      if (resultError) throw resultError;

      // Check if all results for this test are scored
      const { data: allResults, error: fetchError } = await supabase
        .from('test_results')
        .select('scored_at')
        .eq('test_id', test.id);

      if (fetchError) throw fetchError;

      const allScored = allResults?.every(r => r.scored_at !== null);

      if (allScored) {
        // Update test status to complete
        const { error: testError } = await supabase
          .from('tests')
          .update({ status: 'complete' })
          .eq('id', test.id);

        if (testError) throw testError;

        // Trigger LLM analysis (fire and forget)
        try {
          const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
          await fetch(`https://${projectId}.supabase.co/functions/v1/analyze-model-map`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ category: promptCategory }),
          });
        } catch (e) {
          console.log('LLM analysis triggered in background');
        }
      }
    },
    onSuccess: () => {
      toast.success('Scores saved!');
      onSaved();
    },
    onError: (error) => {
      toast.error('Failed to save scores: ' + error.message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(26, 11, 46, 0.95)',
          border: '2px solid hsl(var(--color-cyan) / 0.4)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
        }}
      >
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
              {model.name}
            </DialogTitle>
            <p className="text-sm text-[hsl(var(--color-pink))]">{model.provider}</p>
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
          {/* Accuracy */}
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-cyan))]">Accuracy</Label>
            <StarRating value={scores.accuracy} onChange={(v) => setScores({ ...scores, accuracy: v })} />
          </div>

          {/* Speed */}
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-cyan))]">Speed</Label>
            <div className="flex items-center gap-4">
              <StarRating value={scores.speed} onChange={(v) => setScores({ ...scores, speed: v })} />
              <div className="flex gap-1">
                {(['slow', 'medium', 'fast'] as const).map((label) => (
                  <Button
                    key={label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setScores({ ...scores, speedLabel: label })}
                    className={`text-xs capitalize ${
                      scores.speedLabel === label
                        ? 'bg-cyan-500/20 border-cyan-500 text-[hsl(var(--color-cyan))]'
                        : 'border-cyan-500/30 text-[hsl(var(--color-light-text))]'
                    }`}
                  >
                    {label === 'fast' && <Zap className="h-3 w-3 mr-1" />}
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-cyan))]">Style</Label>
            <StarRating value={scores.style} onChange={(v) => setScores({ ...scores, style: v })} />
          </div>

          {/* Practical Guidance */}
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-cyan))]">Practical Guidance</Label>
            <StarRating value={scores.practicalGuidance} onChange={(v) => setScores({ ...scores, practicalGuidance: v })} />
          </div>

          {/* Technical Detail */}
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-cyan))]">Technical Detail</Label>
            <StarRating value={scores.technicalDetail} onChange={(v) => setScores({ ...scores, technicalDetail: v })} />
          </div>

          {/* X-Factor */}
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-yellow))]">X-Factor (Optional)</Label>
            <StarRating
              value={scores.xFactor}
              onChange={(v) => setScores({ ...scores, xFactor: v })}
              max={3}
              icon="sparkle"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-[hsl(var(--color-cyan))]">Notes</Label>
            <Textarea
              value={scores.notes}
              onChange={(e) => setScores({ ...scores, notes: e.target.value })}
              placeholder="Add observations about this model's performance..."
              rows={3}
              className="bg-[hsl(var(--color-violet))] border-cyan-500/30 text-[hsl(var(--color-light-text))]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-pink-500/50 text-[hsl(var(--color-pink))] hover:bg-pink-500/10"
          >
            Cancel
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="btn-hero"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Scores'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
