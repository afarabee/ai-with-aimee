import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Edit3, Plus, Calendar, Send, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { parseMarkdownContent } from '@/utils/markdownParser';
import type { Newsletter, NewsletterBlock, SelectedItemFromDashboard } from '@/types/newsletter';
import AdminLayout from '@/components/admin/AdminLayout';

interface SortableBlockProps {
  block: NewsletterBlock;
  onEdit: (id: string, context: string) => void;
  onRemove: (id: string) => void;
}

function SortableBlock({ block, onEdit, onRemove }: SortableBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [context, setContext] = useState(block.context || '');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveContext = () => {
    onEdit(block.id, context);
    setIsEditing(false);
    toast.success('Context updated');
  };

  const getBadgeColor = () => {
    switch (block.type) {
      case 'blog': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'project': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      case 'prompt': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'note': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="newsletter-composer-block p-4 mb-3 bg-background/40 border-2"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 text-muted-foreground hover:text-cyan-400 transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getBadgeColor()}>
              {block.type.toUpperCase()}
            </Badge>
            <h3 className="font-rajdhani font-bold text-lg text-cyan-400">
              {block.title}
            </h3>
          </div>

          {block.summary && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {block.summary}
            </p>
          )}

          {isEditing ? (
            <div className="mt-3 space-y-2">
              <Label className="text-xs text-cyan-400">Add Your Commentary</Label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add your personal notes or context for this item..."
                className="min-h-[100px] bg-background/60 border-cyan-500/30 focus:border-cyan-500"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveContext}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50"
                >
                  Save Context
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setContext(block.context || '');
                    setIsEditing(false);
                  }}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {block.context && (
                <div className="mt-2 p-3 bg-background/30 border border-cyan-500/20 rounded-md">
                  <p className="text-sm text-cyan-300 italic">{block.context}</p>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="mt-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                {block.context ? 'Edit Context' : 'Add Context'}
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => onRemove(block.id)}
          className="text-muted-foreground hover:text-pink-400 transition-colors mt-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
}

export default function NewsletterComposer() {
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState<Partial<Newsletter>>({
    title: '',
    subject: '',
    body: '',
    blocks: [],
    status: 'draft',
    send_type: 'adhoc',
  });
  const [blocks, setBlocks] = useState<NewsletterBlock[]>([]);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load selections from sessionStorage on mount
  useEffect(() => {
    const savedSelections = sessionStorage.getItem('newsletterSelections');
    if (savedSelections) {
      try {
        const selections: SelectedItemFromDashboard[] = JSON.parse(savedSelections);
        const initialBlocks: NewsletterBlock[] = selections.map((item) => ({
          id: crypto.randomUUID(),
          type: item.type,
          source_id: item.id,
          title: item.title,
          summary: item.data?.excerpt || item.data?.subtitle || item.data?.category || '',
        }));
        setBlocks(initialBlocks);
      } catch (error) {
        console.error('Failed to load selections:', error);
        toast.error('Failed to load selections from dashboard');
      }
    }
  }, []);

  // Compile markdown body from blocks
  const compiledBody = useMemo(() => {
    let markdown = `# ${newsletter.title || 'Untitled Newsletter'}\n\n`;
    
    blocks.forEach((block) => {
      markdown += `---\n\n`;
      markdown += `## ${block.title}\n\n`;
      
      if (block.summary) {
        markdown += `${block.summary}\n\n`;
      }
      
      if (block.context) {
        markdown += `_${block.context}_\n\n`;
      }
    });

    markdown += `---\n\n`;
    markdown += `**AI with Aimee – Intelligence with a Twist** 🧠✨\n`;

    return markdown;
  }, [newsletter.title, blocks]);

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<Newsletter>) => {
      const payload = {
        title: data.title || newsletter.title || '',
        subject: data.subject || newsletter.subject || '',
        blocks: JSON.parse(JSON.stringify(blocks)) as any,
        body: compiledBody,
        status: 'draft' as const,
        send_type: 'adhoc' as const,
      };

      if (newsletter.id) {
        const { data: updated, error } = await supabase
          .from('newsletter_queue')
          .update(payload)
          .eq('id', newsletter.id)
          .select()
          .single();
        
        if (error) throw error;
        return updated;
      } else {
        const { data: created, error } = await supabase
          .from('newsletter_queue')
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        return created;
      }
    },
    onSuccess: (data) => {
      setNewsletter(prev => ({ ...prev, id: data.id }));
      toast.success('Draft saved successfully', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });
    },
    onError: (error) => {
      console.error('Save draft error:', error);
      toast.error('Failed to save draft');
    },
  });

  // Send now mutation
  const sendNowMutation = useMutation({
    mutationFn: async (data: Partial<Newsletter>) => {
      const payload = {
        title: data.title || newsletter.title || '',
        subject: data.subject || newsletter.subject || '',
        blocks: JSON.parse(JSON.stringify(blocks)) as any,
        body: compiledBody,
        status: 'queued' as const,
        send_type: 'adhoc' as const,
        scheduled_date: new Date().toISOString(),
      };

      if (newsletter.id) {
        const { data: updated, error } = await supabase
          .from('newsletter_queue')
          .update(payload)
          .eq('id', newsletter.id)
          .select()
          .single();
        
        if (error) throw error;
        return updated;
      } else {
        const { data: created, error } = await supabase
          .from('newsletter_queue')
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        return created;
      }
    },
    onSuccess: () => {
      toast.success('Newsletter queued for sending', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      setTimeout(() => navigate('/admin/newsletter-dashboard'), 1500);
    },
    onError: (error) => {
      console.error('Send now error:', error);
      toast.error('Failed to queue newsletter');
    },
  });

  // Schedule send mutation
  const scheduleSendMutation = useMutation({
    mutationFn: async ({ data, date }: { data: Partial<Newsletter>; date: Date }) => {
      const payload = {
        title: data.title || newsletter.title || '',
        subject: data.subject || newsletter.subject || '',
        blocks: JSON.parse(JSON.stringify(blocks)) as any,
        body: compiledBody,
        status: 'queued' as const,
        send_type: 'scheduled' as const,
        scheduled_date: date.toISOString(),
      };

      if (newsletter.id) {
        const { data: updated, error } = await supabase
          .from('newsletter_queue')
          .update(payload)
          .eq('id', newsletter.id)
          .select()
          .single();
        
        if (error) throw error;
        return updated;
      } else {
        const { data: created, error } = await supabase
          .from('newsletter_queue')
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        return created;
      }
    },
    onSuccess: (_, variables) => {
      toast.success(`Newsletter scheduled for ${format(variables.date, 'PPP p')}`, {
        style: {
          background: 'rgba(249, 249, 64, 0.1)',
          border: '1px solid hsl(var(--color-yellow))',
          color: 'hsl(var(--color-yellow))',
        },
      });
      setTimeout(() => navigate('/admin/newsletter-dashboard'), 1500);
    },
    onError: (error) => {
      console.error('Schedule send error:', error);
      toast.error('Failed to schedule newsletter');
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.info('Block reordered');
    }
  };

  const handleEditContext = (id: string, context: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, context } : block
      )
    );
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
    toast.info('Block removed');
  };

  const handleAddPersonalNote = () => {
    const newNote: NewsletterBlock = {
      id: crypto.randomUUID(),
      type: 'note',
      title: 'Personal Note',
      summary: '',
      context: '',
    };
    setBlocks((prev) => [...prev, newNote]);
    toast.success('Personal note added');
  };

  const handleSaveDraft = () => {
    if (!newsletter.title?.trim() || !newsletter.subject?.trim()) {
      toast.error('Please provide a title and subject');
      return;
    }
    saveDraftMutation.mutate(newsletter);
  };

  const handleSendNow = () => {
    if (!newsletter.title?.trim() || !newsletter.subject?.trim()) {
      toast.error('Please provide a title and subject');
      return;
    }
    if (blocks.length === 0) {
      toast.error('Please add at least one content block');
      return;
    }
    sendNowMutation.mutate(newsletter);
  };

  const handleScheduleSend = () => {
    if (!newsletter.title?.trim() || !newsletter.subject?.trim()) {
      toast.error('Please provide a title and subject');
      return;
    }
    if (blocks.length === 0) {
      toast.error('Please add at least one content block');
      return;
    }
    setShowScheduleDialog(true);
  };

  const handleConfirmSchedule = () => {
    if (!scheduledDate) {
      toast.error('Please select a date and time');
      return;
    }
    scheduleSendMutation.mutate({ data: newsletter, date: scheduledDate });
    setShowScheduleDialog(false);
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    sessionStorage.removeItem('newsletterSelections');
    toast.info('Draft discarded');
    navigate('/admin/newsletter-dashboard');
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-rajdhani font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              🧠 Newsletter Composer
            </h1>
            <p className="text-muted-foreground text-lg">
              Craft your newsletter with selected content, personal notes, and custom commentary
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-pink-500 mt-4 rounded-full" />
          </div>

          {/* Main Content */}
          <div className="lg:hidden mb-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'editor' | 'preview')}>
              <TabsList className="w-full newsletter-tabs">
                <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid lg:grid-cols-[1fr_500px] gap-6">
            {/* Left Column - Editor */}
            <div className={activeTab === 'editor' ? 'block' : 'hidden lg:block'}>
              <div className="space-y-6">
                {/* Newsletter Info */}
                <Card className="p-6 bg-background/40 border-2 border-cyan-500/30">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-cyan-400 font-rajdhani font-semibold">
                        Newsletter Title
                      </Label>
                      <Input
                        id="title"
                        value={newsletter.title}
                        onChange={(e) => setNewsletter(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter newsletter title..."
                        className="mt-2 bg-background/60 border-cyan-500/30 focus:border-cyan-500 text-lg font-rajdhani"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-cyan-400 font-rajdhani font-semibold">
                        Email Subject Line
                      </Label>
                      <Input
                        id="subject"
                        value={newsletter.subject}
                        onChange={(e) => setNewsletter(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Enter email subject..."
                        className="mt-2 bg-background/60 border-cyan-500/30 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </Card>

                {/* Content Blocks */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-rajdhani font-bold text-cyan-400">
                      Content Blocks ({blocks.length})
                    </h2>
                    <Button
                      onClick={handleAddPersonalNote}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Personal Note
                    </Button>
                  </div>

                  {blocks.length === 0 ? (
                    <Card className="p-8 text-center bg-background/20 border-2 border-dashed border-cyan-500/30">
                      <p className="text-muted-foreground">
                        No content blocks yet. Go back to the Dashboard to select content, or add a personal note.
                      </p>
                    </Card>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={blocks.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {blocks.map((block) => (
                          <SortableBlock
                            key={block.id}
                            block={block}
                            onEdit={handleEditContext}
                            onRemove={handleRemoveBlock}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className={activeTab === 'preview' ? 'block' : 'hidden lg:block'}>
              <div className="newsletter-preview-panel sticky top-8 p-6 rounded-lg border-2 border-cyan-500/50 max-h-[calc(100vh-4rem)] overflow-auto">
                <h2 className="text-xl font-rajdhani font-bold text-cyan-400 mb-4">
                  Live Preview
                </h2>
                <div className="newsletter-preview-content prose prose-invert max-w-none">
                  {parseMarkdownContent(compiledBody)}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t-2 border-cyan-500/50 p-4 z-50">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDiscardDialog(true)}
                className="border-gray-500 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Discard Draft
              </Button>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleSaveDraft}
                  disabled={saveDraftMutation.isPending}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveDraftMutation.isPending ? 'Saving...' : 'Save Draft'}
                </Button>

                <Button
                  onClick={handleSendNow}
                  disabled={sendNowMutation.isPending}
                  className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/50"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendNowMutation.isPending ? 'Queueing...' : 'Send Now'}
                </Button>

                <Button
                  onClick={handleScheduleSend}
                  disabled={scheduleSendMutation.isPending}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent className="bg-background border-2 border-pink-500/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-pink-400 font-rajdhani text-2xl">
              Discard Draft?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your current draft and clear all selections. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-500">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscard}
              className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/50"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Schedule Dialog */}
      <AlertDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <AlertDialogContent className="bg-background border-2 border-yellow-500/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-400 font-rajdhani text-2xl">
              Schedule Newsletter Send
            </AlertDialogTitle>
            <AlertDialogDescription>
              Choose a date and time for your newsletter to be sent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-yellow-500/30"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, 'PPP p') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border-yellow-500/50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-500">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSchedule}
              className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/50"
            >
              Confirm Schedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
