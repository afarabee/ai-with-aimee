import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, Image, Save, Trash2, Smile, Underline, Maximize2, Minimize2, RemoveFormatting, Minus, Copy, Check, FileUp } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import ProjectPreview from '@/components/admin/ProjectPreview';
import ImageUploadModal from '@/components/admin/ImageUploadModal';
import AssetPicker from '@/components/admin/AssetPicker';
import LinkedInShareField from '@/components/admin/LinkedInShareField';
import { TableBuilder } from '@/components/admin/TableBuilder';
import { EditableTableWrapper } from '@/components/admin/EditableTableWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { slugify } from '@/utils/slugify';
// editorStyleUtils removed — toolbar now produces clean markdown only
import { handleListKeyDown } from '@/utils/editorListUtils';

const projectSchema = z.object({
  project_title: z.string().min(1, 'Title required').max(200),
  subtitle: z.string().min(1, 'Subtitle required').max(200),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  body: z.string().min(1, 'Content required'),
  technologies: z.string().min(1, 'At least one technology required'),
  thumbnail: z.string().url().optional().or(z.literal('')),
  github_link: z.string().url().optional().or(z.literal('')),
  project_page_link: z.string().url().optional().or(z.literal('')),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  display_order: z.number().default(0),
  date_published: z.string(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const underline: ICommand = { name: 'underline', keyCommand: 'underline', buttonProps: { 'aria-label': 'Underline text', title: 'Underline text' }, icon: <Underline size={14} />, execute: (state, api) => api.replaceSelection(`<u>${state.selectedText || 'text'}</u>`) };


export default function ProjectEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navGuard = useNavigationGuard();
  const [projectId, setProjectId] = useState<string | null>(searchParams.get('id'));
  const [body, setBody] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [showNavigateAwayDialog, setShowNavigateAwayDialog] = useState(false);
  const [initialFormData, setInitialFormData] = useState<ProjectFormData | null>(null);
  const [initialBody, setInitialBody] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [cursorImageModalOpen, setCursorImageModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [jsonImportModalOpen, setJsonImportModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [confirmOverwriteOpen, setConfirmOverwriteOpen] = useState(false);
  const [pendingJsonData, setPendingJsonData] = useState<Record<string, unknown> | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, getValues, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: 'Draft', display_order: 0, date_published: new Date().toISOString().split('T')[0], excerpt: '' },
  });

  const formData = watch();

  useEffect(() => {
    if (projectId) {
      (async () => {
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (!error && data) {
          const formData = { project_title: data.project_title, subtitle: data.subtitle, excerpt: data.excerpt || '', body: data.body, technologies: data.technologies.join(', '), thumbnail: data.thumbnail || '', github_link: data.github_link || '', project_page_link: data.project_page_link || '', status: data.status as any, display_order: data.display_order, date_published: new Date(data.date_published).toISOString().split('T')[0] };
          reset(formData);
          setBody(data.body);
          setInitialFormData(formData);
          setInitialBody(data.body);
        }
        setLoading(false);
      })();
    } else {
      // For new projects, set initial values so isDirty can detect changes
      const defaultFormData: ProjectFormData = { project_title: '', subtitle: '', excerpt: '', body: '', technologies: '', thumbnail: '', github_link: '', project_page_link: '', status: 'Draft', display_order: 0, date_published: new Date().toISOString().split('T')[0] };
      setInitialFormData(defaultFormData);
      setInitialBody('');
    }
  }, [projectId]);

  const isDirty = useMemo(() => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData) || body !== initialBody;
  }, [formData, body, initialFormData, initialBody]);

  // Sync dirty state with navigation guard context
  useEffect(() => {
    navGuard.setIsDirty(isDirty);
    return () => navGuard.setIsDirty(false);
  }, [isDirty]);

  // Show dialog when navigation is blocked by sidebar
  useEffect(() => {
    if (navGuard.pendingNavigation) {
      setShowNavigateAwayDialog(true);
    }
  }, [navGuard.pendingNavigation]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const saveDraft = async () => {
    const data = getValues();
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const slug = slugify(data.project_title);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, excerpt: data.excerpt || '', body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: 'Draft', display_order: data.display_order, date_published: data.date_published, slug };
    if (projectId) { 
      await supabase.from('projects').update(payload).eq('id', projectId); 
      toast.success('Draft saved');
    }
    else { 
      const { data: newProj } = await supabase.from('projects').insert([payload]).select().single(); 
      if (newProj) { 
        setProjectId(newProj.id); 
        navigate(`/admin/project-editor?id=${newProj.id}`, { replace: true }); 
        toast.success('Draft saved');
      } 
    }
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const publishProject = async () => {
    const data = getValues();
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const slug = slugify(data.project_title);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, excerpt: data.excerpt || '', body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: 'Active', display_order: data.display_order, date_published: new Date().toISOString(), slug };
    if (projectId) { 
      await supabase.from('projects').update(payload).eq('id', projectId); 
      toast.success('Project published!');
    }
    else { 
      const { data: newProj } = await supabase.from('projects').insert([payload]).select().single(); 
      if (newProj) { 
        setProjectId(newProj.id); 
        navigate(`/admin/project-editor?id=${newProj.id}`, { replace: true }); 
        toast.success('Project published!');
      } 
    }
    setValue('status', 'Active');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const updatePublished = async () => {
    if (!projectId) return;
    const data = getValues();
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const slug = slugify(data.project_title);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, excerpt: data.excerpt || '', body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: 'Active', display_order: data.display_order, date_published: data.date_published, slug };
    await supabase.from('projects').update(payload).eq('id', projectId); 
    toast.success('Published project updated!');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const unpublishProject = async () => {
    if (!projectId) return;
    const data = getValues();
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const slug = slugify(data.project_title);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, excerpt: data.excerpt || '', body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: 'Draft', display_order: data.display_order, date_published: data.date_published, slug };
    await supabase.from('projects').update(payload).eq('id', projectId); 
    toast.success('Project unpublished');
    setValue('status', 'Draft');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const archiveProject = async () => {
    if (!projectId) return;
    const data = getValues();
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const slug = slugify(data.project_title);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, excerpt: data.excerpt || '', body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: 'Archived', display_order: data.display_order, date_published: data.date_published, slug };
    await supabase.from('projects').update(payload).eq('id', projectId); 
    toast.success('Project archived');
    setValue('status', 'Archived');
    setArchiveDialogOpen(false);
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const restoreProject = async () => {
    if (!projectId) return;
    const data = getValues();
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const slug = slugify(data.project_title);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, excerpt: data.excerpt || '', body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: 'Active', display_order: data.display_order, date_published: new Date().toISOString(), slug };
    await supabase.from('projects').update(payload).eq('id', projectId); 
    toast.success('Project restored to Active');
    setValue('status', 'Active');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const handleBackClick = () => {
    navigate('/admin/project-dashboard');
  };

  const handleClearClick = () => {
    if (isDirty) {
      setClearDialogOpen(true);
    } else {
      handleClearForm();
    }
  };

  const handleClearForm = () => { 
    reset({ project_title: '', subtitle: '', excerpt: '', body: '', technologies: '', thumbnail: '', github_link: '', project_page_link: '', status: 'Draft', display_order: 0, date_published: new Date().toISOString().split('T')[0] });
    setBody(''); 
    setProjectId(null); 
    setInitialFormData(null);
    setInitialBody('');
    navigate('/admin/project-editor', { replace: true }); 
    setClearDialogOpen(false); 
  };
  const emojiCommand: ICommand = { name: 'emoji', keyCommand: 'emoji', buttonProps: { 'aria-label': 'Emoji', title: 'Insert emoji' }, icon: <Smile size={14} />, execute: () => setShowEmojiPicker(!showEmojiPicker) };
  
  const clearFormatting: ICommand = {
    name: 'clearFormatting',
    keyCommand: 'clearFormatting',
    buttonProps: { 'aria-label': 'Clear formatting - removes HTML styling from selected text', title: 'Clear formatting' },
    icon: (
      <span
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
          if (!textarea) return;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          if (start === end) {
            toast.info('Select text to clear formatting');
            return;
          }
          const selectedText = body.substring(start, end);
          const cleanedText = selectedText.replace(/<[^>]*>/g, '');
          const newValue = body.substring(0, start) + cleanedText + body.substring(end);
          setBody(newValue);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + cleanedText.length);
          }, 0);
          toast.success('Formatting cleared');
        }}
        style={{ cursor: 'pointer' }}
      >
        <RemoveFormatting size={14} />
      </span>
    ),
    execute: () => {},
  };

  const tableCommand: ICommand = {
    name: 'table',
    keyCommand: 'table',
    buttonProps: { 'aria-label': 'Insert table', title: 'Insert table' },
    icon: (
      <TableBuilder 
        onInsert={(markdown) => {
          setBody((prev) => prev + '\n\n' + markdown + '\n\n');
        }}
      />
    ),
  };

  const neonDividerCommand: ICommand = {
    name: 'neonDivider',
    keyCommand: 'neonDivider',
    buttonProps: { 'aria-label': 'Insert neon divider line', title: 'Insert neon divider' },
    icon: (
      <span
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
          if (!textarea) return;
          const pos = textarea.selectionStart;
          const newValue = body.substring(0, pos) + '\n\n---\n\n' + body.substring(pos);
          setBody(newValue);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(pos + 6, pos + 6);
          }, 0);
        }}
        style={{ cursor: 'pointer' }}
      >
        <Minus size={14} />
      </span>
    ),
    execute: () => {},
  };

  const insertImageCommand: ICommand = {
    name: 'insertImage',
    keyCommand: 'insertImage',
    buttonProps: { 'aria-label': 'Insert image at cursor', title: 'Insert image at cursor' },
    icon: (
      <span
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
          if (textarea) {
            setCursorPosition(textarea.selectionStart);
          }
          setCursorImageModalOpen(true);
        }}
        style={{ cursor: 'pointer' }}
      >
        <Image size={14} />
      </span>
    ),
    execute: () => {},
  };

  const insertHeading = (level: number) => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const currentBody = body || '';
    const selectedText = currentBody.substring(start, end);
    const prefix = '#'.repeat(level) + ' ';
    const textToInsert = selectedText || `Heading ${level}`;
    const insertion = `${prefix}${textToInsert}`;

    const newBody = currentBody.substring(0, start) + insertion + currentBody.substring(end);
    setBody(newBody);

    const newPos = start + insertion.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const HeadingButton = ({ level }: { level: number }) => (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        insertHeading(level);
      }}
      style={{
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'inline-block',
        minWidth: '24px',
        textAlign: 'center',
        fontSize:
          level === 1 ? '16px' :
          level === 2 ? '14px' :
          level === 3 ? '12px' :
          '11px',
      }}
    >
      {`H${level}`}
    </span>
  );

  const heading1Command: ICommand = {
    name: 'heading1',
    keyCommand: 'heading1',
    buttonProps: { 'aria-label': 'Insert Heading 1', title: 'Heading 1' },
    icon: <HeadingButton level={1} />,
  };

  const heading2Command: ICommand = {
    name: 'heading2',
    keyCommand: 'heading2',
    buttonProps: { 'aria-label': 'Insert Heading 2', title: 'Heading 2' },
    icon: <HeadingButton level={2} />,
  };

  const heading3Command: ICommand = {
    name: 'heading3',
    keyCommand: 'heading3',
    buttonProps: { 'aria-label': 'Insert Heading 3', title: 'Heading 3' },
    icon: <HeadingButton level={3} />,
  };

  const heading4Command: ICommand = {
    name: 'heading4',
    keyCommand: 'heading4',
    buttonProps: { 'aria-label': 'Insert Heading 4', title: 'Heading 4' },
    icon: <HeadingButton level={4} />,
  };

  const editorCommands = [
    commands.bold,
    commands.italic,
    underline,
    commands.strikethrough,
    commands.divider,
    heading1Command,
    heading2Command,
    heading3Command,
    heading4Command,
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.divider,
    tableCommand,
    neonDividerCommand,
    insertImageCommand,
    commands.divider,
    emojiCommand,
    clearFormatting,
  ];

  const cleanAllHtml = () => {
    const spanDivRegex = /<(span|div)\s+style="[^"]*">([\s\S]*?)<\/\1>/g;
    let cleaned = body;
    let count = 0;
    let prev = '';
    while (prev !== cleaned) {
      prev = cleaned;
      cleaned = cleaned.replace(spanDivRegex, (_, _tag, content) => { count++; return content; });
    }
    if (count === 0) {
      toast.info('No HTML formatting found to clean');
      return;
    }
    setBody(cleaned);
    setValue('body', cleaned);
    toast.success(`Removed ${count} HTML formatting tag${count > 1 ? 's' : ''}. Review and save.`);
  };

  const previewData = useMemo(() => ({ title: formData.project_title || 'Untitled', subtitle: formData.subtitle || '', body, thumbnail: formData.thumbnail, technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) : [], githubLink: formData.github_link, projectPageLink: formData.project_page_link, publishDate: formData.date_published || new Date().toISOString(), status: formData.status }), [formData, body]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setViewMode('edit');
    } else {
      setViewMode('split');
    }
  };

  const applyJsonToForm = (data: Record<string, unknown>) => {
    const stringFields = ['project_title', 'subtitle', 'excerpt', 'github_link', 'project_page_link', 'thumbnail', 'status', 'slug'] as const;
    stringFields.forEach((field) => {
      if (data[field] != null) setValue(field as any, String(data[field]));
    });
    if (data.technologies != null) {
      setValue('technologies', Array.isArray(data.technologies) ? data.technologies.join(', ') : String(data.technologies));
    }
    if (data.display_order != null) {
      setValue('display_order', Number(data.display_order));
    }
    if (data.date_published != null) {
      const d = new Date(String(data.date_published));
      if (!isNaN(d.getTime())) setValue('date_published', d.toISOString().split('T')[0]);
    }
    if (data.body != null) {
      setBody(String(data.body));
      setValue('body', String(data.body));
    }
    setJsonImportModalOpen(false);
    setJsonText('');
    setJsonError('');
    toast.success('Project fields populated from JSON. Review and save when ready.');
  };

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setJsonError('Invalid JSON. Expected an object, not an array or primitive.');
        return;
      }
      if (isDirty) {
        setPendingJsonData(parsed);
        setConfirmOverwriteOpen(true);
      } else {
        applyJsonToForm(parsed);
      }
    } catch {
      setJsonError('Invalid JSON. Please check your formatting and try again.');
    }
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          toast.error('Invalid JSON file. Expected an object, not an array.');
          return;
        }
        if (isDirty) {
          setPendingJsonData(parsed);
          setConfirmOverwriteOpen(true);
        } else {
          applyJsonToForm(parsed);
        }
      } catch {
        toast.error('Invalid JSON file. Please check the file and try again.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-background">
      {!isFullScreen && (
        <div className="border-b border-border bg-card"><div className="max-w-[1800px] mx-auto px-6 py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><Button variant="ghost" size="sm" onClick={handleBackClick}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button><h1 className="text-2xl font-bold">{projectId ? 'Edit Project' : 'New Project'}</h1></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { setJsonError(''); setJsonText(''); setJsonImportModalOpen(true); }}><FileUp className="w-4 h-4 mr-2" />Import JSON</Button><Button variant="outline" size="sm" onClick={cleanAllHtml} title="Strip legacy HTML formatting from content"><RemoveFormatting className="w-4 h-4 mr-2" />Clean HTML</Button><Button variant={viewMode === 'edit' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('edit')}>Edit</Button><Button variant="outline" size="sm" onClick={saveDraft}><Save className="w-4 h-4 mr-2" />Save Draft</Button><Button variant={viewMode === 'split' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('split')}>Split</Button><Button variant={viewMode === 'preview' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('preview')}><Eye className="w-4 h-4 mr-2" />Preview</Button><Button variant="outline" size="sm" onClick={toggleFullScreen} title="Focus mode"><Maximize2 className="w-4 h-4" /></Button></div></div></div></div>
      )}
      {isFullScreen && (
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold">{projectId ? 'Edit Project' : 'New Project'} - Focus Mode</h1>
            <Button variant="outline" size="sm" onClick={toggleFullScreen} title="Exit focus mode">
              <Minimize2 className="w-4 h-4 mr-2" />Exit Focus Mode
            </Button>
          </div>
        </div>
      )}
      <div className={isFullScreen ? "pt-16" : ""}><div className={isFullScreen ? "max-w-5xl mx-auto p-6" : "max-w-[1800px] mx-auto p-6"}><div className={isFullScreen ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="space-y-6"><div className="space-y-6">
            <div><Label>Title *</Label><Input {...register('project_title')} />{errors.project_title && <p className="text-sm text-destructive mt-1">{errors.project_title.message}</p>}</div>
            <div><Label>Subtitle *</Label><Input {...register('subtitle')} />{errors.subtitle && <p className="text-sm text-destructive mt-1">{errors.subtitle.message}</p>}</div>
            <div><Label>Excerpt (shown on cards)</Label><Input {...register('excerpt')} placeholder="Short description for project cards (max 500 chars)" maxLength={500} />{errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>}</div>
            <div><Label>Technologies *</Label><Input {...register('technologies')} placeholder="React, TypeScript" />{errors.technologies && <p className="text-sm text-destructive mt-1">{errors.technologies.message}</p>}</div>
            <div><Label>Thumbnail</Label><div className="flex gap-2"><Input {...register('thumbnail')} /><Button type="button" variant="outline" onClick={() => setIsAssetPickerOpen(true)}>Library</Button></div>{formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-2" />}</div>
            <div><div className="flex justify-between mb-2"><Label>Content *</Label><Button type="button" variant="outline" size="sm" onClick={() => setImageModalOpen(true)}><Image className="w-4 h-4 mr-2" />Insert Image</Button></div><div data-color-mode="dark"><MDEditor value={body} onChange={(val) => setBody(val || '')} commands={editorCommands} height={500} preview="edit" textareaProps={{ onKeyDown: (e) => handleListKeyDown(e, body, setBody) }} /></div>{showEmojiPicker && <div className="absolute z-50 mt-2"><EmojiPicker onEmojiClick={(e) => { setBody(prev => `${prev}${e.emoji}`); setShowEmojiPicker(false); }} theme={Theme.DARK} /></div>}</div>
            <div className="grid grid-cols-2 gap-4"><div><Label>GitHub</Label><Input {...register('github_link')} /></div><div><Label>Demo</Label><Input {...register('project_page_link')} /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Order</Label><Input type="number" {...register('display_order', { valueAsNumber: true })} /></div><div><Label>Date</Label><Input type="date" {...register('date_published')} /></div></div>
            <div className="space-y-3">
              <div>
                <Label className="text-foreground/70">Status</Label>
                <div className="mt-2 flex items-center gap-3">
                  {formData.status === 'Draft' && <Badge variant="outline" className="bg-muted text-muted-foreground">Draft - Not visible to public</Badge>}
                  {formData.status === 'Active' && <Badge className="bg-primary/20 text-primary border-primary">Published - Live and visible</Badge>}
                  {formData.status === 'Archived' && <Badge className="bg-amber-500/20 text-amber-500 border-amber-500">Archived - Hidden but preserved</Badge>}
                </div>
              </div>
              {/* LinkedIn Share URL */}
              {projectId && formData.project_title && (
                <div>
                  <Label>LinkedIn Share URL</Label>
                  <LinkedInShareField slug={slugify(formData.project_title)} type="projects" />
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <Button type="button" onClick={saveDraft}><Save className="w-4 h-4 mr-2" />Save Draft</Button>
                {formData.status === 'Archived' ? (
                  <Button type="button" onClick={restoreProject}><RotateCcw className="w-4 h-4 mr-2" />Restore to Active</Button>
                ) : formData.status === 'Active' ? (
                  <>
                    <Button type="button" onClick={updatePublished} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />Update Published
                    </Button>
                    <Button type="button" variant="outline" onClick={unpublishProject}>Unpublish</Button>
                  </>
                ) : (
                  <Button type="button" onClick={publishProject} className="bg-primary/90 hover:bg-primary">Publish Now</Button>
                )}
                <div className="flex-1"></div>
                {projectId && <Button type="button" variant="outline" onClick={() => setArchiveDialogOpen(true)} className="text-amber-500 border-amber-500 hover:bg-amber-500/10">Archive</Button>}
                <Button type="button" variant="outline" onClick={handleClearClick}>Clear Form</Button>
              </div>
            </div></div></div>
        )}
        {(viewMode === 'split' || viewMode === 'preview') && <div className="lg:sticky lg:top-6 h-[calc(100vh-120px)]"><div className="border rounded-lg overflow-y-auto preview-scrollbar h-full"><EditableTableWrapper body={body} onBodyUpdate={setBody}><ProjectPreview {...previewData} /></EditableTableWrapper></div></div>}
      </div></div></div>
      <ImageUploadModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} onInsert={(url, alt) => { setBody(prev => `${prev}\n\n![${alt}](${url})\n\n`); setImageModalOpen(false); }} />
      <ImageUploadModal open={cursorImageModalOpen} onClose={() => setCursorImageModalOpen(false)} onInsert={(url, alt) => { const imageMarkdown = `![${alt}](${url})`; setBody(prev => prev.substring(0, cursorPosition) + imageMarkdown + prev.substring(cursorPosition)); setCursorImageModalOpen(false); }} />
      <AssetPicker open={isAssetPickerOpen} onClose={() => setIsAssetPickerOpen(false)} onSelect={(url) => { setValue('thumbnail', url); setIsAssetPickerOpen(false); }} />
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Archive Project</AlertDialogTitle><AlertDialogDescription>This will archive the project and hide it from public view. You can restore it later by changing its status back to Active.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={archiveProject} className="bg-amber-500 hover:bg-amber-600">Archive</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Clear Form</AlertDialogTitle><AlertDialogDescription>All unsaved changes will be lost.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleClearForm}>Clear</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showNavigateAwayDialog} onOpenChange={(open) => { setShowNavigateAwayDialog(open); if (!open) navGuard.setPendingNavigation(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Unsaved Changes</AlertDialogTitle><AlertDialogDescription>You have unsaved changes. What would you like to do?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter className="flex-col sm:flex-row gap-2"><AlertDialogCancel onClick={() => navGuard.setPendingNavigation(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { const target = navGuard.pendingNavigation; navGuard.setPendingNavigation(null); if (target) navigate(target); }} className="bg-destructive hover:bg-destructive/90">Exit Without Saving</AlertDialogAction><AlertDialogAction onClick={async () => { await saveDraft(); const target = navGuard.pendingNavigation; navGuard.setPendingNavigation(null); if (target) navigate(target); }}>Save Changes</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <Dialog open={jsonImportModalOpen} onOpenChange={setJsonImportModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Import from JSON</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <input type="file" accept=".json" ref={jsonFileInputRef} className="hidden" onChange={handleJsonFileUpload} />
              <Button variant="outline" className="w-full" onClick={() => jsonFileInputRef.current?.click()}>
                <FileUp className="w-4 h-4 mr-2" />Upload JSON File
              </Button>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <span className="relative bg-background px-2 text-xs text-muted-foreground">or paste JSON below</span>
            </div>
            <Textarea value={jsonText} onChange={(e) => { setJsonText(e.target.value); setJsonError(''); }} placeholder="Paste your project JSON here" className="min-h-[160px] font-mono text-sm" />
            <p className="text-xs text-muted-foreground">Accepted fields: project_title, subtitle, technologies, github_link, project_page_link, status, thumbnail, display_order, body, date_published, slug, excerpt</p>
            {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJsonImportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleJsonImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmOverwriteOpen} onOpenChange={setConfirmOverwriteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Replace Form Values?</AlertDialogTitle><AlertDialogDescription>This will replace the current form values. Continue?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingJsonData(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (pendingJsonData) applyJsonToForm(pendingJsonData); setPendingJsonData(null); setConfirmOverwriteOpen(false); }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
