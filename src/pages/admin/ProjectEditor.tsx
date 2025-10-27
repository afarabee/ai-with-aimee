import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useAutosave } from '@/hooks/useAutosave';

const projectSchema = z.object({
  project_title: z.string().min(1, 'Title required').max(200),
  subtitle: z.string().min(1, 'Subtitle required').max(200),
  challenge: z.string().min(1, 'Challenge required'),
  solution: z.string().min(1, 'Solution required'),
  impact: z.string().min(1, 'Impact required'),
  technologies: z.string().min(1, 'At least one technology required'),
  github_link: z.string().url().optional().or(z.literal('')),
  project_page_link: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).default('Draft'),
  display_order: z.number().default(0),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectEditor() {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('id');
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'Draft',
      display_order: 0,
    },
  });

  const formData = watch();

  // Load existing project if editing
  useEffect(() => {
    if (projectIdFromUrl) {
      loadProjectById(projectIdFromUrl);
    }
  }, [projectIdFromUrl]);

  const loadProjectById = async (projectId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      if (data) {
        setProjectId(data.id);
        reset({
          project_title: data.project_title,
          subtitle: data.subtitle,
          challenge: data.challenge,
          solution: data.solution,
          impact: data.impact,
          technologies: data.technologies.join(', '),
          github_link: data.github_link || '',
          project_page_link: data.project_page_link || '',
          thumbnail: data.thumbnail || '',
          status: data.status as 'Draft' | 'Active' | 'Completed' | 'Archived',
          display_order: data.display_order,
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (data: ProjectFormData) => {
    try {
      const projectData = {
        project_title: data.project_title,
        subtitle: data.subtitle,
        challenge: data.challenge,
        solution: data.solution,
        impact: data.impact,
        technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
        github_link: data.github_link || null,
        project_page_link: data.project_page_link || null,
        thumbnail: data.thumbnail || null,
        status: 'Draft',
        display_order: data.display_order,
        updated_at: new Date().toISOString(),
      };

      if (projectId) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId);

        if (error) throw error;
      } else {
        const { data: newProject, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) throw error;
        if (newProject) {
          setProjectId(newProject.id);
          navigate(`/admin/project-editor?id=${newProject.id}`, { replace: true });
        }
      }

      toast.success('Draft saved', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        project_title: data.project_title,
        subtitle: data.subtitle,
        challenge: data.challenge,
        solution: data.solution,
        impact: data.impact,
        technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
        github_link: data.github_link || null,
        project_page_link: data.project_page_link || null,
        thumbnail: data.thumbnail || null,
        status: data.status,
        display_order: data.display_order,
        updated_at: new Date().toISOString(),
      };

      if (projectId) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId);

        if (error) throw error;
      } else {
        const { data: newProject, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) throw error;
        if (newProject) {
          setProjectId(newProject.id);
        }
      }

      toast.success(data.status === 'Active' ? 'Project published!' : 'Project saved', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });

      navigate('/admin/project-dashboard');
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(`Failed to save project: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Project deleted', {
        style: {
          background: 'rgba(249, 249, 64, 0.1)',
          border: '1px solid hsl(var(--color-yellow))',
          color: 'hsl(var(--color-yellow))',
        },
      });
      navigate('/admin/project-dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleClearForm = () => {
    reset({
      project_title: '',
      subtitle: '',
      challenge: '',
      solution: '',
      impact: '',
      technologies: '',
      github_link: '',
      project_page_link: '',
      thumbnail: '',
      status: 'Draft',
      display_order: 0,
    });
    setProjectId(null);
    navigate('/admin/project-editor', { replace: true });
    setClearDialogOpen(false);
    toast.success('Form cleared');
  };

  // Auto-save every 30 seconds
  useAutosave(
    formData,
    (data) => saveDraft(data),
    30000
  );

  const previewData = useMemo(
    () => ({
      project_title: formData.project_title || 'Untitled Project',
      subtitle: formData.subtitle || '',
      challenge: formData.challenge || '',
      solution: formData.solution || '',
      impact: formData.impact || '',
      technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : [],
      status: formData.status,
    }),
    [formData]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'hsl(var(--color-cyan))' }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Button
              onClick={() => navigate('/admin/project-dashboard')}
              className="inline-flex items-center gap-2 font-rajdhani transition-all"
              style={{ 
                background: 'rgba(0, 255, 255, 0.2)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode('edit')}
                variant={viewMode === 'edit' ? 'default' : 'outline'}
                size="sm"
              >
                <EyeOff size={16} className="mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setViewMode('split')}
                variant={viewMode === 'split' ? 'default' : 'outline'}
                size="sm"
              >
                Split View
              </Button>
              <Button
                onClick={() => setViewMode('preview')}
                variant={viewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
              >
                <Eye size={16} className="mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* Main Layout */}
          <div className={`grid gap-8 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Editor Panel */}
            {viewMode !== 'preview' && (
              <div
                className="p-8 rounded-xl backdrop-blur-md"
                style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  border: '2px solid hsl(var(--color-cyan) / 0.3)',
                  boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.2)',
                }}
              >
                <h2 className="text-2xl font-montserrat font-bold mb-6" style={{ color: 'hsl(var(--color-cyan))' }}>
                  {projectId ? 'Edit Project' : 'New Project'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="project_title">Project Title *</Label>
                    <Input
                      id="project_title"
                      {...register('project_title')}
                      className="mt-2"
                      style={{
                        background: 'rgba(26, 11, 46, 0.6)',
                        borderColor: errors.project_title ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                      }}
                    />
                    {errors.project_title && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.project_title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle *</Label>
                    <Input
                      id="subtitle"
                      {...register('subtitle')}
                      className="mt-2"
                      style={{
                        background: 'rgba(26, 11, 46, 0.6)',
                        borderColor: errors.subtitle ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                      }}
                    />
                    {errors.subtitle && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.subtitle.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setValue('status', value as any)}
                      >
                        <SelectTrigger 
                          className="mt-2"
                          style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        {...register('display_order', { valueAsNumber: true })}
                        className="mt-2"
                        style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="challenge">Challenge *</Label>
                    <Textarea
                      id="challenge"
                      {...register('challenge')}
                      rows={3}
                      className="mt-2"
                      style={{
                        background: 'rgba(26, 11, 46, 0.6)',
                        borderColor: errors.challenge ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                      }}
                    />
                    {errors.challenge && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.challenge.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="solution">Solution *</Label>
                    <Textarea
                      id="solution"
                      {...register('solution')}
                      rows={3}
                      className="mt-2"
                      style={{
                        background: 'rgba(26, 11, 46, 0.6)',
                        borderColor: errors.solution ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                      }}
                    />
                    {errors.solution && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.solution.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="impact">Impact *</Label>
                    <Textarea
                      id="impact"
                      {...register('impact')}
                      rows={3}
                      className="mt-2"
                      style={{
                        background: 'rgba(26, 11, 46, 0.6)',
                        borderColor: errors.impact ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                      }}
                    />
                    {errors.impact && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.impact.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="technologies">Technologies *</Label>
                    <Input
                      id="technologies"
                      {...register('technologies')}
                      placeholder="Python, OpenAI, n8n"
                      className="mt-2"
                      style={{
                        background: 'rgba(26, 11, 46, 0.6)',
                        borderColor: errors.technologies ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                      }}
                    />
                    <p className="mt-1 text-xs" style={{ color: 'hsl(var(--color-cyan))' }}>
                      Comma-separated list
                    </p>
                    {errors.technologies && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.technologies.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="github_link">GitHub Repository</Label>
                    <Input
                      id="github_link"
                      {...register('github_link')}
                      type="url"
                      placeholder="https://github.com/..."
                      className="mt-2"
                      style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="project_page_link">Project Page Link</Label>
                    <Input
                      id="project_page_link"
                      {...register('project_page_link')}
                      placeholder="/projects/my-project"
                      className="mt-2"
                      style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      {...register('thumbnail')}
                      type="url"
                      placeholder="https://..."
                      className="mt-2"
                      style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => handleSubmit((data) => saveDraft(data))()}
                      className="flex-1"
                      style={{
                        background: 'rgba(0, 255, 255, 0.2)',
                        border: '2px solid hsl(var(--color-cyan))',
                        color: 'hsl(var(--color-cyan))',
                      }}
                    >
                      <Save size={16} className="mr-2" />
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      style={{
                        background: 'rgba(249, 249, 64, 0.2)',
                        border: '2px solid hsl(var(--color-yellow))',
                        color: 'hsl(var(--color-yellow))',
                      }}
                    >
                      Publish
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setClearDialogOpen(true)}
                      variant="outline"
                      className="flex-1"
                      style={{
                        background: 'rgba(245, 12, 160, 0.1)',
                        border: '2px solid hsl(var(--color-pink))',
                        color: 'hsl(var(--color-pink))',
                      }}
                    >
                      Clear Form
                    </Button>
                    {projectId && (
                      <Button
                        type="button"
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="outline"
                        className="flex-1"
                        style={{
                          background: 'rgba(255, 0, 0, 0.1)',
                          border: '2px solid #ff0000',
                          color: '#ff0000',
                        }}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Project
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Preview Panel */}
            {viewMode !== 'edit' && (
              <div
                className="p-8 rounded-xl backdrop-blur-md"
                style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  border: '2px solid hsl(var(--color-pink) / 0.3)',
                  boxShadow: '0 0 30px hsl(var(--color-pink) / 0.2)',
                }}
              >
                <h2 className="text-2xl font-montserrat font-bold mb-6" style={{ color: 'hsl(var(--color-pink))' }}>
                  Preview
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-rajdhani font-bold" style={{ color: 'hsl(var(--color-cyan))' }}>
                      {previewData.project_title}
                    </h3>
                    <p className="text-lg font-ibm-plex mt-2" style={{ color: 'hsl(var(--color-light-text))' }}>
                      {previewData.subtitle}
                    </p>
                  </div>

                  {previewData.technologies.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {previewData.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm font-rajdhani rounded"
                          style={{
                            background: 'rgba(0, 255, 255, 0.15)',
                            border: '1px solid #00ffff',
                            color: '#00ffff',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {previewData.challenge && (
                    <div>
                      <h4 className="text-lg font-rajdhani font-bold mb-2" style={{ color: 'hsl(var(--color-yellow))' }}>
                        Challenge
                      </h4>
                      <p className="font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                        {previewData.challenge}
                      </p>
                    </div>
                  )}

                  {previewData.solution && (
                    <div>
                      <h4 className="text-lg font-rajdhani font-bold mb-2" style={{ color: 'hsl(var(--color-yellow))' }}>
                        Solution
                      </h4>
                      <p className="font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                        {previewData.solution}
                      </p>
                    </div>
                  )}

                  {previewData.impact && (
                    <div>
                      <h4 className="text-lg font-rajdhani font-bold mb-2" style={{ color: 'hsl(var(--color-yellow))' }}>
                        Impact
                      </h4>
                      <p className="font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                        {previewData.impact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-pink) / 0.5)',
            boxShadow: '0 0 40px hsl(var(--color-pink) / 0.3)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle 
              className="font-rajdhani text-2xl"
              style={{ color: 'hsl(var(--color-pink))' }}
            >
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription 
              className="font-ibm-plex"
              style={{ color: 'hsl(var(--color-light-text))' }}
            >
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: 'rgba(0, 255, 255, 0.1)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              style={{
                background: 'rgba(245, 12, 160, 0.2)',
                border: '2px solid hsl(var(--color-pink))',
                color: 'hsl(var(--color-pink))',
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Form Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-cyan) / 0.5)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle 
              className="font-rajdhani text-2xl"
              style={{ color: 'hsl(var(--color-cyan))' }}
            >
              Clear Form
            </AlertDialogTitle>
            <AlertDialogDescription 
              className="font-ibm-plex"
              style={{ color: 'hsl(var(--color-light-text))' }}
            >
              Are you sure you want to clear the form? All unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: 'rgba(0, 255, 255, 0.1)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearForm}
              style={{
                background: 'rgba(245, 12, 160, 0.2)',
                border: '2px solid hsl(var(--color-pink))',
                color: 'hsl(var(--color-pink))',
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
