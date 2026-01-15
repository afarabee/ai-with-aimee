import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Bot, ExternalLink, Copy, Check } from 'lucide-react';
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

interface ModelFormData {
  name: string;
  provider: string;
  description: string;
  tags: string;
  url: string;
}

export default function ModelsDashboard() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [deleteModel, setDeleteModel] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    provider: '',
    description: '',
    tags: '',
    url: ''
  });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Fetch all models
  const { data: models, isLoading } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('date_added', { ascending: false });
      if (error) throw error;
      return data as Model[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ModelFormData) => {
      const tagsArray = data.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        name: data.name,
        provider: data.provider,
        description: data.description || null,
        tags: tagsArray,
        url: data.url.trim() || null,
      };

      if (editingModel) {
        const { error } = await supabase
          .from('models')
          .update(payload)
          .eq('id', editingModel.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('models')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success(editingModel ? 'Model updated!' : 'Model added!');
      handleCloseForm();
    },
    onError: (error) => {
      toast.error('Failed to save model: ' + error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Model deleted!');
      setDeleteModel(null);
    },
    onError: (error) => {
      toast.error('Failed to delete model: ' + error.message);
    },
  });

  const handleOpenForm = (model?: Model) => {
    if (model) {
      setEditingModel(model);
      setFormData({
        name: model.name,
        provider: model.provider,
        description: model.description || '',
        tags: model.tags.join(', '),
        url: model.url || '',
      });
    } else {
      setEditingModel(null);
      setFormData({ name: '', provider: '', description: '', tags: '', url: '' });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingModel(null);
    setFormData({ name: '', provider: '', description: '', tags: '', url: '' });
  };

  const handleCopyUrl = async (url: string, modelId: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(modelId);
    toast.success('URL copied!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.provider.trim()) {
      toast.error('Name and Provider are required');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-rajdhani font-bold neon-text-cyan">My Models</h1>
          <p className="text-[hsl(var(--color-light-text))] opacity-70 mt-1">
            Manage your library of AI models for testing
          </p>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="btn-hero gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Model
        </Button>
      </div>

      {/* Models Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse" style={{ background: 'rgba(26, 11, 46, 0.6)', border: '1px solid hsl(var(--color-cyan) / 0.2)' }}>
              <div className="h-6 bg-cyan-500/20 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-cyan-500/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-cyan-500/20 rounded w-full"></div>
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
          <Button onClick={() => handleOpenForm()} className="btn-hero gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Model
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models?.map((model) => (
            <Card
              key={model.id}
              className="p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
              style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '1px solid hsl(var(--color-cyan) / 0.3)',
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
                    {model.name}
                  </h3>
                  <p className="text-sm text-[hsl(var(--color-pink))]">{model.provider}</p>
                  {model.url && (
                    <div className="flex items-center gap-1 mt-1">
                      <a
                        href={model.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[hsl(var(--color-cyan))] hover:text-[hsl(var(--color-pink))] transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">
                          {(() => {
                            try {
                              return new URL(model.url).hostname;
                            } catch {
                              return model.url;
                            }
                          })()}
                        </span>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyUrl(model.url!, model.id)}
                        className="h-5 w-5 text-[hsl(var(--color-cyan))] hover:bg-cyan-500/20"
                      >
                        {copiedUrl === model.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenForm(model)}
                    className="h-8 w-8 text-[hsl(var(--color-cyan))] hover:bg-cyan-500/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteModel({ id: model.id, name: model.name })}
                    className="h-8 w-8 text-[hsl(var(--color-pink))] hover:bg-pink-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {model.description && (
                <p className="text-sm text-[hsl(var(--color-light-text))] opacity-80 mb-3 line-clamp-2">
                  {model.description}
                </p>
              )}

              {model.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {model.tags.map((tag, idx) => (
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
                Added {format(new Date(model.date_added), 'MMM d, yyyy')}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent
          className="sm:max-w-md"
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-cyan) / 0.4)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-rajdhani font-bold text-[hsl(var(--color-cyan))]">
              {editingModel ? 'Edit Model' : 'Add New Model'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[hsl(var(--color-cyan))]">
                Name <span className="text-[hsl(var(--color-pink))]">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Claude 4.5 Sonnet"
                className="bg-[hsl(var(--color-violet))] border-cyan-500/30 text-[hsl(var(--color-light-text))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-[hsl(var(--color-cyan))]">
                Provider <span className="text-[hsl(var(--color-pink))]">*</span>
              </Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Anthropic"
                className="bg-[hsl(var(--color-violet))] border-cyan-500/30 text-[hsl(var(--color-light-text))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-[hsl(var(--color-cyan))]">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="bg-[hsl(var(--color-violet))] border-cyan-500/30 text-[hsl(var(--color-light-text))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[hsl(var(--color-cyan))]">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of the model..."
                rows={3}
                className="bg-[hsl(var(--color-violet))] border-cyan-500/30 text-[hsl(var(--color-light-text))]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-[hsl(var(--color-cyan))]">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., fast, coding, vision"
                className="bg-[hsl(var(--color-violet))] border-cyan-500/30 text-[hsl(var(--color-light-text))]"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                className="border-pink-500/50 text-[hsl(var(--color-pink))] hover:bg-pink-500/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="btn-hero"
              >
                {saveMutation.isPending ? 'Saving...' : editingModel ? 'Update Model' : 'Add Model'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
              onClick={() => deleteModel && deleteMutation.mutate(deleteModel.id)}
              className="bg-pink-500/20 border border-pink-500 text-[hsl(var(--color-pink))] hover:bg-pink-500/30"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
