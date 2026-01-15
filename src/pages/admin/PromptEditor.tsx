import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Send, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'General Purpose',
  'Deep Reasoning',
  'Research',
  'Writing',
  'Coding',
  'Multi-Modal',
  'Other'
];

const promptSchema = z.object({
  title: z.string().min(1, 'Title required').max(200, 'Title must be less than 200 characters'),
  role: z.string().optional(),
  category: z.string().optional(),
  tags: z.string(),
  body: z.string().min(1, 'Prompt body required'),
  status: z.enum(['Draft', 'Published']).default('Draft'),
});

type PromptFormData = z.infer<typeof promptSchema>;

interface Prompt {
  id: string;
  title: string;
  role: string | null;
  category: string | null;
  tags: string[];
  body: string;
  date_created: string;
  last_modified: string;
  status: string;
}

export default function PromptEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const promptId = searchParams.get('id');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');

  const {
    register,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: '',
      role: '',
      category: '',
      tags: '',
      body: '',
      status: 'Draft',
    },
  });

  const formData = watch();

  // Fetch existing prompt if editing
  const { data: prompt } = useQuery({
    queryKey: ['prompt', promptId],
    queryFn: async () => {
      if (!promptId) return null;
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', promptId)
        .single();
      if (error) throw error;
      return data as Prompt;
    },
    enabled: !!promptId,
  });

  // Prefill form when prompt loads
  useEffect(() => {
    if (prompt) {
      reset({
        title: prompt.title,
        role: prompt.role || '',
        category: prompt.category || '',
        tags: prompt.tags.join(', '),
        body: prompt.body,
        status: prompt.status as 'Draft' | 'Published',
      });
    }
  }, [prompt, reset]);

  // Save draft function
  const saveDraft = async () => {
    const data = getValues();
    try {
      const promptData = {
        title: data.title,
        role: data.role || null,
        category: data.category || null,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        body: data.body,
        status: 'Draft',
        last_modified: new Date().toISOString(),
      };

      if (promptId) {
        const { error } = await supabase
          .from('prompts')
          .update(promptData)
          .eq('id', promptId);
        if (error) throw error;
      } else {
        const { data: newPrompt, error } = await supabase
          .from('prompts')
          .insert([promptData])
          .select()
          .single();
        if (error) throw error;
        navigate(`/admin/prompt-editor?id=${newPrompt.id}`, { replace: true });
      }

      // Update form status to reflect saved state
      reset({ ...data, status: 'Draft' });

      toast.success('Draft saved', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  // Publish prompt function
  const publishPrompt = async () => {
    const data = getValues();
    try {
      const promptData = {
        title: data.title,
        role: data.role || null,
        category: data.category || null,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        body: data.body,
        status: 'Published',
        last_modified: new Date().toISOString(),
      };

      if (promptId) {
        const { error } = await supabase
          .from('prompts')
          .update(promptData)
          .eq('id', promptId);
        if (error) throw error;
      } else {
        const { data: newPrompt, error } = await supabase
          .from('prompts')
          .insert([promptData])
          .select()
          .single();
        if (error) throw error;
        navigate(`/admin/prompt-editor?id=${newPrompt.id}`, { replace: true });
      }

      // Update form status to reflect published state
      reset({ ...data, status: 'Published' });

      toast.success('Prompt published!', {
        style: {
          background: 'rgba(249, 249, 64, 0.1)',
          border: '1px solid hsl(var(--color-yellow))',
          color: 'hsl(var(--color-yellow))',
        },
      });
    } catch (error) {
      console.error('Error publishing prompt:', error);
      toast.error('Failed to publish prompt');
    }
  };

  // Update published prompt function
  const updatePublished = async () => {
    const data = getValues();
    try {
      const promptData = {
        title: data.title,
        role: data.role || null,
        category: data.category || null,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        body: data.body,
        status: 'Published',
        last_modified: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('prompts')
        .update(promptData)
        .eq('id', promptId);
      if (error) throw error;

      toast.success('Published prompt updated!', {
        style: {
          background: 'rgba(249, 249, 64, 0.1)',
          border: '1px solid hsl(var(--color-yellow))',
          color: 'hsl(var(--color-yellow))',
        },
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast.error('Failed to update prompt');
    }
  };

  // Unpublish prompt function
  const unpublishPrompt = async () => {
    const data = getValues();
    try {
      const promptData = {
        title: data.title,
        role: data.role || null,
        category: data.category || null,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        body: data.body,
        status: 'Draft',
        last_modified: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('prompts')
        .update(promptData)
        .eq('id', promptId);
      if (error) throw error;

      // Update form status to reflect draft state
      reset({ ...data, status: 'Draft' });

      toast.success('Prompt unpublished', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });
    } catch (error) {
      console.error('Error unpublishing prompt:', error);
      toast.error('Failed to unpublish prompt');
    }
  };

  // Delete prompt
  const handleDelete = async () => {
    if (!promptId) return;

    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);
      
      if (error) throw error;
      
      toast.success('Prompt deleted', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      
      navigate('/admin/prompt-library');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete prompt');
    }
  };

  // Clear form
  const handleClear = () => {
    reset({
      title: '',
      role: '',
      category: '',
      tags: '',
      body: '',
      status: 'Draft',
    });
    setShowClearDialog(false);
  };

  // Parse tags for preview
  const parsedTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
  const charCount = formData.body?.length || 0;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/prompt-library')}
            className="text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode('edit')}
              style={{
                background: viewMode === 'edit' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.05)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
              className="hover:bg-cyan-400/20"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode('split')}
              style={{
                background: viewMode === 'split' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.05)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
              className="hover:bg-cyan-400/20"
            >
              Split
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode('preview')}
              style={{
                background: viewMode === 'preview' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.05)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
              className="hover:bg-cyan-400/20"
            >
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Panel */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <Card className="p-6 bg-card/65 border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              <h2 className="text-2xl font-rajdhani font-bold text-cyan-400 mb-6">
                {promptId ? 'Edit Prompt' : 'New Prompt'}
              </h2>

              <form className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-cyan-300 font-rajdhani">
                    Title <span className="text-pink-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Product Requirements Document Generator"
                    className="border-cyan-400/30 focus:border-cyan-400"
                  />
                  {errors.title && (
                    <p className="text-pink-400 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Role and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role" className="text-cyan-300 font-rajdhani">Role</Label>
                    <Input
                      id="role"
                      {...register('role')}
                      placeholder="Product Manager"
                      className="border-cyan-400/30 focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-cyan-300 font-rajdhani">Category</Label>
                    <Select
                      value={formData.category || ''}
                      onValueChange={(value) => reset({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category" className="border-cyan-400/30 focus:border-cyan-400">
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status (Read-only) */}
                <div>
                  <Label className="text-cyan-300 font-rajdhani">Status</Label>
                  <div className="mt-2">
                    {formData.status === 'Draft' && (
                      <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/50">
                        Draft - Not visible to public
                      </Badge>
                    )}
                    {formData.status === 'Published' && (
                      <Badge className="bg-primary/20 text-primary border-primary border">
                        Published - Available for use
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags" className="text-cyan-300 font-rajdhani">Tags</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="PRD, documentation, requirements"
                    className="border-cyan-400/30 focus:border-cyan-400"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Comma-separated keywords
                  </p>
                  {parsedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {parsedTags.map((tag, idx) => (
                        <span key={idx} className="tag-pill text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div>
                  <Label htmlFor="body" className="text-cyan-300 font-rajdhani">
                    Prompt Body <span className="text-pink-400">*</span>
                  </Label>
                  <Textarea
                    id="body"
                    {...register('body')}
                    rows={12}
                    placeholder="Write your AI prompt here. Use [placeholders] for variables."
                    className="border-cyan-400/30 focus:border-cyan-400 font-mono"
                  />
                  {errors.body && (
                    <p className="text-pink-400 text-sm mt-1">{errors.body.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {charCount} characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {/* Always show Save Draft */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    style={{
                      background: 'rgba(0, 255, 255, 0.1)',
                      border: '2px solid hsl(var(--color-cyan))',
                      color: 'hsl(var(--color-cyan))',
                    }}
                    className="hover:bg-cyan-400/20"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>

                  {/* Status-based buttons */}
                  {formData.status === 'Published' ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={updatePublished}
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '2px solid #22c55e',
                          color: '#22c55e',
                        }}
                        className="hover:bg-green-500/20"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Update Published
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={unpublishPrompt}
                        style={{
                          background: 'rgba(249, 249, 64, 0.1)',
                          border: '2px solid hsl(var(--color-yellow))',
                          color: 'hsl(var(--color-yellow))',
                        }}
                        className="hover:bg-yellow-400/20"
                      >
                        Unpublish
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={publishPrompt}
                      style={{
                        background: 'rgba(249, 249, 64, 0.1)',
                        border: '2px solid hsl(var(--color-yellow))',
                        color: 'hsl(var(--color-yellow))',
                      }}
                      className="hover:bg-yellow-400/20"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Publish Now
                    </Button>
                  )}

                  {/* Clear button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowClearDialog(true)}
                    style={{
                      background: 'rgba(245, 12, 160, 0.1)',
                      border: '2px solid hsl(var(--color-pink))',
                      color: 'hsl(var(--color-pink))',
                    }}
                    className="hover:bg-pink-400/20"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>

                  {/* Delete button (only for existing prompts) */}
                  {promptId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteDialog(true)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '2px solid #ef4444',
                        color: '#ef4444',
                      }}
                      className="hover:bg-red-400/20"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          )}

          {/* Preview Panel */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <Card className="p-6 bg-card/65 border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              <h2 className="text-2xl font-rajdhani font-bold text-cyan-400 mb-6">
                Live Preview
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <h3 className="text-xl font-rajdhani text-pink-400">
                  {formData.title || 'Untitled Prompt'}
                </h3>

                {/* Role & Category */}
                <div className="flex items-center gap-2">
                  <span className="tag-pill">{formData.role || 'No Role'}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-yellow-300">{formData.category || 'No Category'}</span>
                </div>

                {/* Status */}
                <Badge 
                  className={
                    formData.status === 'Published'
                      ? 'bg-yellow-400/15 text-yellow-400 border-2 border-yellow-400 shadow-[0_0_12px_rgba(249,249,64,0.6)]'
                      : 'bg-cyan-400/15 text-cyan-400 border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]'
                  }
                >
                  {formData.status}
                </Badge>

                {/* Tags */}
                {parsedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {parsedTags.map((tag, idx) => (
                      <span key={idx} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Body */}
                <div className="prompt-preview text-[hsl(var(--color-light-text))]">
                  {formData.body || 'No prompt body yet...'}
                </div>

                {/* Character count */}
                <p className="text-xs text-muted-foreground">
                  {charCount} characters
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Clear Form Dialog */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent className="bg-background/95 border-2 border-pink-400/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-pink-400 font-rajdhani">Clear Form?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear all unsaved changes. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-cyan-400 text-cyan-300">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClear}
                className="bg-pink-400/20 border-2 border-pink-400 text-pink-400 hover:bg-pink-400/30"
              >
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Prompt Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-background/95 border-2 border-pink-400/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-pink-400 font-rajdhani">Delete Prompt?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this prompt. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-cyan-400 text-cyan-300">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-pink-400/20 border-2 border-pink-400 text-pink-400 hover:bg-pink-400/30"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
