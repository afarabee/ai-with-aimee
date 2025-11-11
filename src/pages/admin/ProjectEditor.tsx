import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, Save, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette, Smile } from 'lucide-react';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
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

// Custom command definitions for MDEditor
const fontSizeSmall: ICommand = {
  name: 'fontSizeSmall',
  keyCommand: 'fontSizeSmall',
  buttonProps: { 'aria-label': 'Small font', title: 'Small font' },
  icon: <span style={{ fontSize: '10px', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="font-size: 0.875rem;">${state.selectedText || 'small text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const fontSizeNormal: ICommand = {
  name: 'fontSizeNormal',
  keyCommand: 'fontSizeNormal',
  buttonProps: { 'aria-label': 'Normal font', title: 'Normal font' },
  icon: <span style={{ fontSize: '12px', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="font-size: 1rem;">${state.selectedText || 'normal text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const fontSizeLarge: ICommand = {
  name: 'fontSizeLarge',
  keyCommand: 'fontSizeLarge',
  buttonProps: { 'aria-label': 'Large font', title: 'Large font' },
  icon: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="font-size: 1.25rem;">${state.selectedText || 'large text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const fontSizeExtraLarge: ICommand = {
  name: 'fontSizeExtraLarge',
  keyCommand: 'fontSizeExtraLarge',
  buttonProps: { 'aria-label': 'Extra large font', title: 'Extra large font' },
  icon: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="font-size: 1.5rem;">${state.selectedText || 'extra large text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorBlack: ICommand = {
  name: 'colorBlack',
  keyCommand: 'colorBlack',
  buttonProps: { 'aria-label': 'Black text', title: 'Black text' },
  icon: <span style={{ color: '#000000', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #000000;">${state.selectedText || 'black text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorCyan: ICommand = {
  name: 'colorCyan',
  keyCommand: 'colorCyan',
  buttonProps: { 'aria-label': 'Cyan text (primary)', title: 'Cyan text (primary)' },
  icon: <span style={{ color: '#00ffff', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #00ffff;">${state.selectedText || 'cyan text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorPink: ICommand = {
  name: 'colorPink',
  keyCommand: 'colorPink',
  buttonProps: { 'aria-label': 'Pink text (secondary)', title: 'Pink text (secondary)' },
  icon: <span style={{ color: '#f50ca0', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #f50ca0;">${state.selectedText || 'pink text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorGray: ICommand = {
  name: 'colorGray',
  keyCommand: 'colorGray',
  buttonProps: { 'aria-label': 'Gray text (muted)', title: 'Gray text (muted)' },
  icon: <span style={{ color: '#a1a1aa', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #a1a1aa;">${state.selectedText || 'gray text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorRed: ICommand = {
  name: 'colorRed',
  keyCommand: 'colorRed',
  buttonProps: { 'aria-label': 'Red text (error)', title: 'Red text (error)' },
  icon: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #ef4444;">${state.selectedText || 'red text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorGreen: ICommand = {
  name: 'colorGreen',
  keyCommand: 'colorGreen',
  buttonProps: { 'aria-label': 'Green text (success)', title: 'Green text (success)' },
  icon: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #22c55e;">${state.selectedText || 'green text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorYellow: ICommand = {
  name: 'colorYellow',
  keyCommand: 'colorYellow',
  buttonProps: { 'aria-label': 'Yellow text (warning)', title: 'Yellow text (warning)' },
  icon: <span style={{ color: '#f9f940', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #f9f940;">${state.selectedText || 'yellow text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const colorBlue: ICommand = {
  name: 'colorBlue',
  keyCommand: 'colorBlue',
  buttonProps: { 'aria-label': 'Blue text (info)', title: 'Blue text (info)' },
  icon: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>A</span>,
  execute: (state, api) => {
    const modifyText = `<span style="color: #3b82f6;">${state.selectedText || 'blue text'}</span>`;
    api.replaceSelection(modifyText);
  },
};

const alignLeft: ICommand = {
  name: 'alignLeft',
  keyCommand: 'alignLeft',
  buttonProps: { 'aria-label': 'Align left', title: 'Align left' },
  icon: <AlignLeft size={14} />,
  execute: (state, api) => {
    const modifyText = `<div style="text-align: left;">\n\n${state.selectedText || 'Left aligned text'}\n\n</div>`;
    api.replaceSelection(modifyText);
  },
};

const alignCenter: ICommand = {
  name: 'alignCenter',
  keyCommand: 'alignCenter',
  buttonProps: { 'aria-label': 'Align center', title: 'Align center' },
  icon: <AlignCenter size={14} />,
  execute: (state, api) => {
    const modifyText = `<div style="text-align: center;">\n\n${state.selectedText || 'Center aligned text'}\n\n</div>`;
    api.replaceSelection(modifyText);
  },
};

const alignRight: ICommand = {
  name: 'alignRight',
  keyCommand: 'alignRight',
  buttonProps: { 'aria-label': 'Align right', title: 'Align right' },
  icon: <AlignRight size={14} />,
  execute: (state, api) => {
    const modifyText = `<div style="text-align: right;">\n\n${state.selectedText || 'Right aligned text'}\n\n</div>`;
    api.replaceSelection(modifyText);
  },
};

const alignJustify: ICommand = {
  name: 'alignJustify',
  keyCommand: 'alignJustify',
  buttonProps: { 'aria-label': 'Justify text', title: 'Justify text' },
  icon: <AlignJustify size={14} />,
  execute: (state, api) => {
    const modifyText = `<div style="text-align: justify;">\n\n${state.selectedText || 'Justified text'}\n\n</div>`;
    api.replaceSelection(modifyText);
  },
};

export default function ProjectEditor() {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('id');
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Emoji picker states for each field
  const [showChallengeEmoji, setShowChallengeEmoji] = useState(false);
  const [showSolutionEmoji, setShowSolutionEmoji] = useState(false);
  const [showImpactEmoji, setShowImpactEmoji] = useState(false);
  const [challengeTextApi, setChallengeTextApi] = useState<any>(null);
  const [solutionTextApi, setSolutionTextApi] = useState<any>(null);
  const [impactTextApi, setImpactTextApi] = useState<any>(null);
  
  // Editor content states
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [impact, setImpact] = useState('');

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
        setChallenge(data.challenge);
        setSolution(data.solution);
        setImpact(data.impact);
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
    setChallenge('');
    setSolution('');
    setImpact('');
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

  // Emoji commands for each field
  const challengeEmojiCommand: ICommand = {
    name: 'emoji',
    keyCommand: 'emoji',
    buttonProps: { 'aria-label': 'Insert emoji', title: 'Insert emoji' },
    icon: <Smile size={14} />,
    execute: () => setShowChallengeEmoji(!showChallengeEmoji),
  };

  const solutionEmojiCommand: ICommand = {
    name: 'emoji',
    keyCommand: 'emoji',
    buttonProps: { 'aria-label': 'Insert emoji', title: 'Insert emoji' },
    icon: <Smile size={14} />,
    execute: () => setShowSolutionEmoji(!showSolutionEmoji),
  };

  const impactEmojiCommand: ICommand = {
    name: 'emoji',
    keyCommand: 'emoji',
    buttonProps: { 'aria-label': 'Insert emoji', title: 'Insert emoji' },
    icon: <Smile size={14} />,
    execute: () => setShowImpactEmoji(!showImpactEmoji),
  };

  const handleChallengeEmojiClick = (emojiData: EmojiClickData) => {
    if (challengeTextApi) {
      challengeTextApi.replaceSelection(emojiData.emoji);
    }
    setShowChallengeEmoji(false);
  };

  const handleSolutionEmojiClick = (emojiData: EmojiClickData) => {
    if (solutionTextApi) {
      solutionTextApi.replaceSelection(emojiData.emoji);
    }
    setShowSolutionEmoji(false);
  };

  const handleImpactEmojiClick = (emojiData: EmojiClickData) => {
    if (impactTextApi) {
      impactTextApi.replaceSelection(emojiData.emoji);
    }
    setShowImpactEmoji(false);
  };

  // Shared commands array
  const editorCommands = [
    commands.group(
      [
        { ...commands.title1, buttonProps: { ...commands.title1.buttonProps, title: 'Heading 1' }},
        { ...commands.title2, buttonProps: { ...commands.title2.buttonProps, title: 'Heading 2' }},
        { ...commands.title3, buttonProps: { ...commands.title3.buttonProps, title: 'Heading 3' }},
        { ...commands.title4, buttonProps: { ...commands.title4.buttonProps, title: 'Heading 4' }},
        { ...commands.title5, buttonProps: { ...commands.title5.buttonProps, title: 'Heading 5' }},
        { ...commands.title6, buttonProps: { ...commands.title6.buttonProps, title: 'Heading 6' }},
      ],
      {
        name: 'title',
        groupName: 'title',
        buttonProps: { 'aria-label': 'Insert heading', title: 'Insert heading' },
      }
    ),
    commands.divider,
    commands.group(
      [fontSizeSmall, fontSizeNormal, fontSizeLarge, fontSizeExtraLarge],
      {
        name: 'fontSize',
        groupName: 'fontSize',
        icon: <span style={{ fontSize: '12px', fontWeight: 'bold' }}>A</span>,
        buttonProps: { 'aria-label': 'Font size', title: 'Font size' },
      }
    ),
    commands.divider,
    commands.group(
      [colorBlack, colorCyan, colorPink, colorGray, colorRed, colorGreen, colorYellow, colorBlue],
      {
        name: 'textColor',
        groupName: 'textColor',
        icon: <Palette size={14} />,
        buttonProps: { 'aria-label': 'Text color', title: 'Text color' },
      }
    ),
    commands.divider,
    commands.group(
      [alignLeft, alignCenter, alignRight, alignJustify],
      {
        name: 'textAlign',
        groupName: 'textAlign',
        icon: <AlignLeft size={14} />,
        buttonProps: { 'aria-label': 'Text alignment', title: 'Text alignment' },
      }
    ),
    commands.divider,
  ];

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
                    <div data-color-mode="dark" className="relative mt-2">
                      <MDEditor
                        value={challenge}
                        onChange={(val) => {
                          setChallenge(val || '');
                          setValue('challenge', val || '');
                        }}
                        height={400}
                        preview="edit"
                        visibleDragbar={false}
                        textareaProps={{
                          onFocus: (e) => {
                            const textarea = e.target;
                            setChallengeTextApi({
                              replaceSelection: (text: string) => {
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const newValue = challenge.substring(0, start) + text + challenge.substring(end);
                                setChallenge(newValue);
                                setValue('challenge', newValue);
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + text.length, start + text.length);
                                }, 0);
                              }
                            });
                          }
                        }}
                        commands={[
                          ...editorCommands,
                          challengeEmojiCommand,
                          commands.divider,
                          { ...commands.bold, buttonProps: { ...commands.bold.buttonProps, title: 'Bold text (Ctrl+B)' }},
                          { ...commands.italic, buttonProps: { ...commands.italic.buttonProps, title: 'Italic text (Ctrl+I)' }},
                          { ...commands.strikethrough, buttonProps: { ...commands.strikethrough.buttonProps, title: 'Strikethrough' }},
                          commands.divider,
                          { ...commands.hr, buttonProps: { ...commands.hr.buttonProps, title: 'Horizontal rule' }},
                          { ...commands.link, buttonProps: { ...commands.link.buttonProps, title: 'Insert link (Ctrl+K)' }},
                          { ...commands.quote, buttonProps: { ...commands.quote.buttonProps, title: 'Insert quote' }},
                          { ...commands.code, buttonProps: { ...commands.code.buttonProps, title: 'Insert code (Ctrl+J)' }},
                          commands.divider,
                          { ...commands.unorderedListCommand, buttonProps: { ...commands.unorderedListCommand.buttonProps, title: 'Unordered list' }},
                          { ...commands.orderedListCommand, buttonProps: { ...commands.orderedListCommand.buttonProps, title: 'Ordered list' }},
                          { ...commands.checkedListCommand, buttonProps: { ...commands.checkedListCommand.buttonProps, title: 'Checked list' }},
                        ]}
                      />
                      {showChallengeEmoji && (
                        <div className="absolute z-50 mt-2">
                          <EmojiPicker onEmojiClick={handleChallengeEmojiClick} theme={Theme.DARK} />
                        </div>
                      )}
                    </div>
                    {errors.challenge && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.challenge.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="solution">Solution *</Label>
                    <div data-color-mode="dark" className="relative mt-2">
                      <MDEditor
                        value={solution}
                        onChange={(val) => {
                          setSolution(val || '');
                          setValue('solution', val || '');
                        }}
                        height={400}
                        preview="edit"
                        visibleDragbar={false}
                        textareaProps={{
                          onFocus: (e) => {
                            const textarea = e.target;
                            setSolutionTextApi({
                              replaceSelection: (text: string) => {
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const newValue = solution.substring(0, start) + text + solution.substring(end);
                                setSolution(newValue);
                                setValue('solution', newValue);
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + text.length, start + text.length);
                                }, 0);
                              }
                            });
                          }
                        }}
                        commands={[
                          ...editorCommands,
                          solutionEmojiCommand,
                          commands.divider,
                          { ...commands.bold, buttonProps: { ...commands.bold.buttonProps, title: 'Bold text (Ctrl+B)' }},
                          { ...commands.italic, buttonProps: { ...commands.italic.buttonProps, title: 'Italic text (Ctrl+I)' }},
                          { ...commands.strikethrough, buttonProps: { ...commands.strikethrough.buttonProps, title: 'Strikethrough' }},
                          commands.divider,
                          { ...commands.hr, buttonProps: { ...commands.hr.buttonProps, title: 'Horizontal rule' }},
                          { ...commands.link, buttonProps: { ...commands.link.buttonProps, title: 'Insert link (Ctrl+K)' }},
                          { ...commands.quote, buttonProps: { ...commands.quote.buttonProps, title: 'Insert quote' }},
                          { ...commands.code, buttonProps: { ...commands.code.buttonProps, title: 'Insert code (Ctrl+J)' }},
                          commands.divider,
                          { ...commands.unorderedListCommand, buttonProps: { ...commands.unorderedListCommand.buttonProps, title: 'Unordered list' }},
                          { ...commands.orderedListCommand, buttonProps: { ...commands.orderedListCommand.buttonProps, title: 'Ordered list' }},
                          { ...commands.checkedListCommand, buttonProps: { ...commands.checkedListCommand.buttonProps, title: 'Checked list' }},
                        ]}
                      />
                      {showSolutionEmoji && (
                        <div className="absolute z-50 mt-2">
                          <EmojiPicker onEmojiClick={handleSolutionEmojiClick} theme={Theme.DARK} />
                        </div>
                      )}
                    </div>
                    {errors.solution && (
                      <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                        {errors.solution.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="impact">Impact *</Label>
                    <div data-color-mode="dark" className="relative mt-2">
                      <MDEditor
                        value={impact}
                        onChange={(val) => {
                          setImpact(val || '');
                          setValue('impact', val || '');
                        }}
                        height={400}
                        preview="edit"
                        visibleDragbar={false}
                        textareaProps={{
                          onFocus: (e) => {
                            const textarea = e.target;
                            setImpactTextApi({
                              replaceSelection: (text: string) => {
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const newValue = impact.substring(0, start) + text + impact.substring(end);
                                setImpact(newValue);
                                setValue('impact', newValue);
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + text.length, start + text.length);
                                }, 0);
                              }
                            });
                          }
                        }}
                        commands={[
                          ...editorCommands,
                          impactEmojiCommand,
                          commands.divider,
                          { ...commands.bold, buttonProps: { ...commands.bold.buttonProps, title: 'Bold text (Ctrl+B)' }},
                          { ...commands.italic, buttonProps: { ...commands.italic.buttonProps, title: 'Italic text (Ctrl+I)' }},
                          { ...commands.strikethrough, buttonProps: { ...commands.strikethrough.buttonProps, title: 'Strikethrough' }},
                          commands.divider,
                          { ...commands.hr, buttonProps: { ...commands.hr.buttonProps, title: 'Horizontal rule' }},
                          { ...commands.link, buttonProps: { ...commands.link.buttonProps, title: 'Insert link (Ctrl+K)' }},
                          { ...commands.quote, buttonProps: { ...commands.quote.buttonProps, title: 'Insert quote' }},
                          { ...commands.code, buttonProps: { ...commands.code.buttonProps, title: 'Insert code (Ctrl+J)' }},
                          commands.divider,
                          { ...commands.unorderedListCommand, buttonProps: { ...commands.unorderedListCommand.buttonProps, title: 'Unordered list' }},
                          { ...commands.orderedListCommand, buttonProps: { ...commands.orderedListCommand.buttonProps, title: 'Ordered list' }},
                          { ...commands.checkedListCommand, buttonProps: { ...commands.checkedListCommand.buttonProps, title: 'Checked list' }},
                        ]}
                      />
                      {showImpactEmoji && (
                        <div className="absolute z-50 mt-2">
                          <EmojiPicker onEmojiClick={handleImpactEmojiClick} theme={Theme.DARK} />
                        </div>
                      )}
                    </div>
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
                      <div 
                        className="font-ibm-plex prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: previewData.challenge }}
                        style={{ color: 'hsl(var(--color-light-text))' }}
                      />
                    </div>
                  )}

                  {previewData.solution && (
                    <div>
                      <h4 className="text-lg font-rajdhani font-bold mb-2" style={{ color: 'hsl(var(--color-yellow))' }}>
                        Solution
                      </h4>
                      <div 
                        className="font-ibm-plex prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: previewData.solution }}
                        style={{ color: 'hsl(var(--color-light-text))' }}
                      />
                    </div>
                  )}

                  {previewData.impact && (
                    <div>
                      <h4 className="text-lg font-rajdhani font-bold mb-2" style={{ color: 'hsl(var(--color-yellow))' }}>
                        Impact
                      </h4>
                      <div 
                        className="font-ibm-plex prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: previewData.impact }}
                        style={{ color: 'hsl(var(--color-light-text))' }}
                      />
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
