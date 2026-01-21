import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Bot, Wrench, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  tags: string[];
  url: string | null;
  date_added: string;
  last_modified: string;
}

interface Tool {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  tags: string[];
  url: string | null;
  date_added: string;
  last_modified: string;
}

interface FormData {
  name: string;
  provider: string;
  description: string;
  tags: string;
  url: string;
}

export default function ModelsToolsDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('models');
  
  // Model state
  const [isModelFormOpen, setIsModelFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [deleteModel, setDeleteModel] = useState<{ id: string; name: string } | null>(null);
  const [modelFormData, setModelFormData] = useState<FormData>({
    name: '', provider: '', description: '', tags: '', url: ''
  });
  
  // Tool state
  const [isToolFormOpen, setIsToolFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deleteTool, setDeleteTool] = useState<{ id: string; name: string } | null>(null);
  const [toolFormData, setToolFormData] = useState<FormData>({
    name: '', provider: '', description: '', tags: '', url: ''
  });
  
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Fetch models
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Model[];
    },
  });

  // Fetch tools
  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Tool[];
    },
  });

  // Model mutations
  const saveModelMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const tagsArray = data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const payload = {
        name: data.name,
        provider: data.provider,
        description: data.description || null,
        tags: tagsArray,
        url: data.url.trim() || null,
      };
      if (editingModel) {
        const { error } = await supabase.from('models').update(payload).eq('id', editingModel.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('models').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success(editingModel ? 'Model updated!' : 'Model added!');
      handleCloseModelForm();
    },
    onError: (error) => toast.error('Failed to save model: ' + error.message),
  });

  const deleteModelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('models').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Model deleted!');
      setDeleteModel(null);
    },
    onError: (error) => toast.error('Failed to delete model: ' + error.message),
  });

  // Tool mutations
  const saveToolMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const tagsArray = data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const payload = {
        name: data.name,
        provider: data.provider,
        description: data.description || null,
        tags: tagsArray,
        url: data.url.trim() || null,
      };
      if (editingTool) {
        const { error } = await supabase.from('tools').update(payload).eq('id', editingTool.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tools').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast.success(editingTool ? 'Tool updated!' : 'Tool added!');
      handleCloseToolForm();
    },
    onError: (error) => toast.error('Failed to save tool: ' + error.message),
  });

  const deleteToolMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tools').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast.success('Tool deleted!');
      setDeleteTool(null);
    },
    onError: (error) => toast.error('Failed to delete tool: ' + error.message),
  });

  // Handlers
  const handleOpenModelForm = (model?: Model) => {
    if (model) {
      setEditingModel(model);
      setModelFormData({
        name: model.name,
        provider: model.provider,
        description: model.description || '',
        tags: model.tags.join(', '),
        url: model.url || '',
      });
    } else {
      setEditingModel(null);
      setModelFormData({ name: '', provider: '', description: '', tags: '', url: '' });
    }
    setIsModelFormOpen(true);
  };

  const handleCloseModelForm = () => {
    setIsModelFormOpen(false);
    setEditingModel(null);
    setModelFormData({ name: '', provider: '', description: '', tags: '', url: '' });
  };

  const handleOpenToolForm = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setToolFormData({
        name: tool.name,
        provider: tool.provider,
        description: tool.description || '',
        tags: tool.tags.join(', '),
        url: tool.url || '',
      });
    } else {
      setEditingTool(null);
      setToolFormData({ name: '', provider: '', description: '', tags: '', url: '' });
    }
    setIsToolFormOpen(true);
  };

  const handleCloseToolForm = () => {
    setIsToolFormOpen(false);
    setEditingTool(null);
    setToolFormData({ name: '', provider: '', description: '', tags: '', url: '' });
  };

  const handleCopyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(id);
    toast.success('URL copied!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelFormData.name.trim() || !modelFormData.provider.trim()) {
      toast.error('Name and Provider are required');
      return;
    }
    saveModelMutation.mutate(modelFormData);
  };

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolFormData.name.trim() || !toolFormData.provider.trim()) {
      toast.error('Name and Provider are required');
      return;
    }
    saveToolMutation.mutate(toolFormData);
  };

  const renderItemCard = (
    item: Model | Tool,
    type: 'model' | 'tool',
    onEdit: () => void,
    onDelete: () => void
  ) => {
    const Icon = type === 'model' ? Bot : Wrench;
    const colorHue = type === 'model' ? 'cyan' : 'pink';
    
    return (
      <Card
        key={item.id}
        className="p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
        style={{
          background: 'rgba(26, 11, 46, 0.6)',
          border: `1px solid hsl(var(--color-${colorHue}) / 0.3)`,
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 text-[hsl(var(--color-${colorHue}))]`} />
              <h3 className={`text-lg font-rajdhani font-bold text-[hsl(var(--color-${colorHue}))]`}>
                {item.name}
              </h3>
            </div>
            <p className="text-sm text-[hsl(var(--color-pink))]">{item.provider}</p>
            {item.url && (
              <div className="flex items-center gap-1 mt-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs text-[hsl(var(--color-${colorHue}))] hover:text-[hsl(var(--color-pink))] transition-colors flex items-center gap-1`}
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">
                    {(() => {
                      try { return new URL(item.url).hostname; } catch { return item.url; }
                    })()}
                  </span>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyUrl(item.url!, item.id)}
                  className={`h-5 w-5 text-[hsl(var(--color-${colorHue}))] hover:bg-${colorHue}-500/20`}
                >
                  {copiedUrl === item.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className={`h-8 w-8 text-[hsl(var(--color-${colorHue}))] hover:bg-${colorHue}-500/20`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-[hsl(var(--color-pink))] hover:bg-pink-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-[hsl(var(--color-light-text))] opacity-80 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: 'hsl(var(--color-yellow) / 0.5)',
                  color: 'hsl(var(--color-yellow))',
                  background: 'hsl(var(--color-yellow) / 0.1)',
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-[hsl(var(--color-light-text))] opacity-50">
          Added {format(new Date(item.date_added), 'MMM d, yyyy')}
        </p>
      </Card>
    );
  };

  const renderFormModal = (
    isOpen: boolean,
    onClose: () => void,
    formData: FormData,
    setFormData: (data: FormData) => void,
    onSubmit: (e: React.FormEvent) => void,
    isEditing: boolean,
    isPending: boolean,
    type: 'model' | 'tool'
  ) => {
    const colorHue = type === 'model' ? 'cyan' : 'pink';
    const title = isEditing ? `Edit ${type === 'model' ? 'Model' : 'Tool'}` : `Add New ${type === 'model' ? 'Model' : 'Tool'}`;
    const placeholder = type === 'model' 
      ? { name: 'e.g., Claude 4.5 Sonnet', provider: 'e.g., Anthropic' }
      : { name: 'e.g., Google AI Studio', provider: 'e.g., Google' };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-md"
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: `2px solid hsl(var(--color-${colorHue}) / 0.4)`,
            boxShadow: `0 0 40px rgba(${type === 'model' ? '0, 255, 255' : '245, 12, 160'}, 0.2)`,
          }}
        >
          <DialogHeader>
            <DialogTitle className={`text-xl font-rajdhani font-bold text-[hsl(var(--color-${colorHue}))]`}>
              {title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={`text-[hsl(var(--color-${colorHue}))]`}>
                Name <span className="text-[hsl(var(--color-pink))]">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={placeholder.name}
                className={`bg-[hsl(var(--color-violet))] border-${colorHue}-500/30 text-[hsl(var(--color-light-text))]`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider" className={`text-[hsl(var(--color-${colorHue}))]`}>
                Provider <span className="text-[hsl(var(--color-pink))]">*</span>
              </Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder={placeholder.provider}
                className={`bg-[hsl(var(--color-violet))] border-${colorHue}-500/30 text-[hsl(var(--color-light-text))]`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className={`text-[hsl(var(--color-${colorHue}))]`}>URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className={`bg-[hsl(var(--color-violet))] border-${colorHue}-500/30 text-[hsl(var(--color-light-text))]`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className={`text-[hsl(var(--color-${colorHue}))]`}>Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={`Short description of the ${type}...`}
                rows={3}
                className={`bg-[hsl(var(--color-violet))] border-${colorHue}-500/30 text-[hsl(var(--color-light-text))]`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className={`text-[hsl(var(--color-${colorHue}))]`}>Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={type === 'model' ? 'e.g., fast, coding, vision' : 'e.g., chat, coding, agentic'}
                className={`bg-[hsl(var(--color-violet))] border-${colorHue}-500/30 text-[hsl(var(--color-light-text))]`}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-pink-500/50 text-[hsl(var(--color-pink))] hover:bg-pink-500/10"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="btn-hero">
                {isPending ? 'Saving...' : isEditing ? `Update ${type === 'model' ? 'Model' : 'Tool'}` : `Add ${type === 'model' ? 'Model' : 'Tool'}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-rajdhani font-bold neon-text-cyan">Models & Tools</h1>
          <p className="text-[hsl(var(--color-light-text))] opacity-70 mt-1">
            Manage your library of AI models and tools for testing
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList
            className="bg-transparent border border-cyan-500/30"
            style={{ background: 'rgba(26, 11, 46, 0.6)' }}
          >
            <TabsTrigger
              value="models"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-[hsl(var(--color-cyan))] text-[hsl(var(--color-light-text))]"
            >
              <Bot className="h-4 w-4 mr-2" />
              Models ({models?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-[hsl(var(--color-pink))] text-[hsl(var(--color-light-text))]"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Tools ({tools?.length || 0})
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => activeTab === 'models' ? handleOpenModelForm() : handleOpenToolForm()}
            className="btn-hero gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New {activeTab === 'models' ? 'Model' : 'Tool'}
          </Button>
        </div>

        {/* Models Tab */}
        <TabsContent value="models">
          {modelsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse" style={{ background: 'rgba(26, 11, 46, 0.6)', border: '1px solid hsl(var(--color-cyan) / 0.2)' }}>
                  <div className="h-6 bg-cyan-500/20 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-cyan-500/20 rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          ) : models?.length === 0 ? (
            <Card className="p-12 text-center" style={{ background: 'rgba(26, 11, 46, 0.6)', border: '1px solid hsl(var(--color-cyan) / 0.2)' }}>
              <Bot className="h-16 w-16 mx-auto mb-4 text-[hsl(var(--color-cyan))] opacity-50" />
              <h3 className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))] mb-2">No Models Yet</h3>
              <p className="text-[hsl(var(--color-light-text))] opacity-70 mb-4">
                Add your first AI model to start building your testing library
              </p>
              <Button onClick={() => handleOpenModelForm()} className="btn-hero gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Model
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models?.map((model) => renderItemCard(
                model,
                'model',
                () => handleOpenModelForm(model),
                () => setDeleteModel({ id: model.id, name: model.name })
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools">
          {toolsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse" style={{ background: 'rgba(26, 11, 46, 0.6)', border: '1px solid hsl(var(--color-pink) / 0.2)' }}>
                  <div className="h-6 bg-pink-500/20 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-pink-500/20 rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          ) : tools?.length === 0 ? (
            <Card className="p-12 text-center" style={{ background: 'rgba(26, 11, 46, 0.6)', border: '1px solid hsl(var(--color-pink) / 0.2)' }}>
              <Wrench className="h-16 w-16 mx-auto mb-4 text-[hsl(var(--color-pink))] opacity-50" />
              <h3 className="text-xl font-rajdhani font-bold text-[hsl(var(--color-pink))] mb-2">No Tools Yet</h3>
              <p className="text-[hsl(var(--color-light-text))] opacity-70 mb-4">
                Add your first AI tool (like Google AI Studio, Lovable, Claude Code) to test
              </p>
              <Button onClick={() => handleOpenToolForm()} className="bg-pink-500/20 border border-pink-500 text-[hsl(var(--color-pink))] hover:bg-pink-500/30 gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Tool
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools?.map((tool) => renderItemCard(
                tool,
                'tool',
                () => handleOpenToolForm(tool),
                () => setDeleteTool({ id: tool.id, name: tool.name })
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Model Form Modal */}
      {renderFormModal(
        isModelFormOpen,
        handleCloseModelForm,
        modelFormData,
        setModelFormData,
        handleModelSubmit,
        !!editingModel,
        saveModelMutation.isPending,
        'model'
      )}

      {/* Tool Form Modal */}
      {renderFormModal(
        isToolFormOpen,
        handleCloseToolForm,
        toolFormData,
        setToolFormData,
        handleToolSubmit,
        !!editingTool,
        saveToolMutation.isPending,
        'tool'
      )}

      {/* Delete Model Confirmation */}
      <AlertDialog open={!!deleteModel} onOpenChange={() => setDeleteModel(null)}>
        <AlertDialogContent
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-pink) / 0.4)',
            boxShadow: '0 0 40px rgba(245, 12, 160, 0.2)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-rajdhani text-[hsl(var(--color-pink))]">
              Delete Model?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--color-light-text))]">
              Are you sure you want to delete <strong className="text-[hsl(var(--color-cyan))]">{deleteModel?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-cyan-500/50 text-[hsl(var(--color-cyan))] hover:bg-cyan-500/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteModel && deleteModelMutation.mutate(deleteModel.id)}
              className="bg-pink-500/20 border border-pink-500 text-[hsl(var(--color-pink))] hover:bg-pink-500/30"
            >
              {deleteModelMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Tool Confirmation */}
      <AlertDialog open={!!deleteTool} onOpenChange={() => setDeleteTool(null)}>
        <AlertDialogContent
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-pink) / 0.4)',
            boxShadow: '0 0 40px rgba(245, 12, 160, 0.2)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-rajdhani text-[hsl(var(--color-pink))]">
              Delete Tool?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--color-light-text))]">
              Are you sure you want to delete <strong className="text-[hsl(var(--color-pink))]">{deleteTool?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-cyan-500/50 text-[hsl(var(--color-cyan))] hover:bg-cyan-500/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTool && deleteToolMutation.mutate(deleteTool.id)}
              className="bg-pink-500/20 border border-pink-500 text-[hsl(var(--color-pink))] hover:bg-pink-500/30"
            >
              {deleteToolMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
