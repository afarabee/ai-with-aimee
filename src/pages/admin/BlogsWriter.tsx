import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { slugify } from '@/utils/slugify';
// editorStyleUtils removed — toolbar now produces clean markdown only
import { handleListKeyDown } from '@/utils/editorListUtils';
import { ArrowLeft, Eye, Image, Save, Trash2, Smile, Underline, Maximize2, Minimize2, RemoveFormatting, Minus, FileUp } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import PasswordGate from '@/components/admin/PasswordGate';
import AboutBackground from '@/components/AboutBackground';
import BlogPreview from '@/components/admin/BlogPreview';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const blogSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  subtitle: z.string().max(200).optional(),
  author: z.string().max(100).default('Aimee Farabee'),
  slug: z.string().min(1, 'Slug required').max(200),
  excerpt: z.string().min(1, 'Excerpt required').max(500),
  body: z.string().min(1, 'Content required'),
  tags: z.string().optional(),
  banner_image: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  date_published: z.string(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const underline: ICommand = { name: 'underline', keyCommand: 'underline', buttonProps: { 'aria-label': 'Underline text', title: 'Underline text' }, icon: <Underline size={14} />, execute: (state, api) => api.replaceSelection(`<u>${state.selectedText || 'text'}</u>`) };


export default function BlogsWriter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [blogId, setBlogId] = useState<string | null>(searchParams.get('id'));
  const [body, setBody] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [showNavigateAwayDialog, setShowNavigateAwayDialog] = useState(false);
  const [initialFormData, setInitialFormData] = useState<BlogFormData | null>(null);
  const [initialBody, setInitialBody] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [cursorImageModalOpen, setCursorImageModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [jsonImportModalOpen, setJsonImportModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [confirmOverwriteOpen, setConfirmOverwriteOpen] = useState(false);
  const [pendingJsonData, setPendingJsonData] = useState<Record<string, any> | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, reset, getValues, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { status: 'draft', author: 'Aimee Farabee', date_published: new Date().toISOString().split('T')[0] },
  });

  const formData = watch();
  const watchedSlug = watch('slug');

  useEffect(() => {
    if (blogId) {
      (async () => {
        setLoading(true);
        const { data, error } = await supabase.from('blogs').select('*').eq('id', blogId).single();
        if (!error && data) {
          const formData = { title: data.title, subtitle: data.subtitle || '', author: data.author || 'Aimee Farabee', slug: data.slug, excerpt: data.excerpt, body: data.body, tags: data.tags || '', banner_image: data.banner_image || '', status: data.status as any, date_published: new Date(data.date_published).toISOString().split('T')[0] };
          reset(formData);
          setBody(data.body);
          setInitialFormData(formData);
          setInitialBody(data.body);
        }
        setLoading(false);
      })();
    } else {
      // For new blogs, set initial values so isDirty can detect changes
      const defaultFormData: BlogFormData = { title: '', subtitle: '', author: 'Aimee Farabee', slug: '', excerpt: '', body: '', tags: '', banner_image: '', status: 'draft', date_published: new Date().toISOString().split('T')[0] };
      setInitialFormData(defaultFormData);
      setInitialBody('');
    }
  }, [blogId]);

  const isDirty = useMemo(() => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData) || body !== initialBody;
  }, [formData, body, initialFormData, initialBody]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const saveDraft = async () => {
    const data = getValues();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug || slugify(data.title), excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'draft', date_published: data.date_published };
    if (blogId) { 
      const { error } = await supabase.from('blogs').update(payload).eq('id', blogId); 
      if (error) { toast.error('Failed to save: ' + error.message); return; }
      toast.success('Draft saved');
    } else { 
      const { data: newBlog, error } = await supabase.from('blogs').insert([payload]).select().single(); 
      if (error) { toast.error('Failed to save: ' + error.message); return; }
      if (newBlog) { 
        setBlogId(newBlog.id); 
        navigate(`/admin/blogs/edit?id=${newBlog.id}`, { replace: true }); 
        toast.success('Draft saved');
      } 
    }
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const publishBlog = async () => {
    const data = getValues();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug || slugify(data.title), excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'published', date_published: new Date().toISOString() };
    if (blogId) { 
      const { error } = await supabase.from('blogs').update(payload).eq('id', blogId); 
      if (error) { toast.error('Failed to publish: ' + error.message); return; }
      toast.success('Blog published!');
    } else { 
      const { data: newBlog, error } = await supabase.from('blogs').insert([payload]).select().single(); 
      if (error) { toast.error('Failed to publish: ' + error.message); return; }
      if (newBlog) { 
        setBlogId(newBlog.id); 
        navigate(`/admin/blogs/edit?id=${newBlog.id}`, { replace: true }); 
        toast.success('Blog published!');
      } 
    }
    setValue('status', 'published');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const updatePublished = async () => {
    if (!blogId) return;
    const data = getValues();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug || slugify(data.title), excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'published', date_published: data.date_published };
    const { error } = await supabase.from('blogs').update(payload).eq('id', blogId); 
    if (error) { toast.error('Failed to update: ' + error.message); return; }
    toast.success('Published blog updated!');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const unpublishBlog = async () => {
    if (!blogId) return;
    const data = getValues();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug || slugify(data.title), excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'draft', date_published: data.date_published };
    const { error } = await supabase.from('blogs').update(payload).eq('id', blogId); 
    if (error) { toast.error('Failed to unpublish: ' + error.message); return; }
    toast.success('Blog unpublished');
    setValue('status', 'draft');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const archiveBlog = async () => {
    if (!blogId) return;
    const data = getValues();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug || slugify(data.title), excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'archived', date_published: data.date_published };
    const { error } = await supabase.from('blogs').update(payload).eq('id', blogId); 
    if (error) { toast.error('Failed to archive: ' + error.message); return; }
    toast.success('Blog archived');
    setValue('status', 'archived');
    setArchiveDialogOpen(false);
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const restoreBlog = async () => {
    if (!blogId) return;
    const data = getValues();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug || slugify(data.title), excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'published', date_published: new Date().toISOString() };
    const { error } = await supabase.from('blogs').update(payload).eq('id', blogId); 
    if (error) { toast.error('Failed to restore: ' + error.message); return; }
    toast.success('Blog restored to Published');
    setValue('status', 'published');
    setInitialFormData(getValues());
    setInitialBody(body);
  };

  const handleBackClick = () => {
    if (isDirty) { setShowNavigateAwayDialog(true); } else { navigate('/admin/blogs'); }
  };

  const handleClearClick = () => {
    if (isDirty) { setClearDialogOpen(true); } else { handleClearForm(); }
  };

  const handleClearForm = () => { 
    reset({ title: '', subtitle: '', author: 'Aimee Farabee', slug: '', excerpt: '', body: '', tags: '', banner_image: '', status: 'draft', date_published: new Date().toISOString().split('T')[0] }); 
    setBody(''); 
    setBlogId(null); 
    setInitialFormData(null);
    setInitialBody('');
    navigate('/admin/blogs/new', { replace: true }); 
    setClearDialogOpen(false); 
  };

  const applyJsonToForm = (data: Record<string, any>) => {
    const fieldMap: (keyof BlogFormData)[] = ['slug', 'title', 'subtitle', 'author', 'tags', 'date_published', 'status', 'excerpt', 'banner_image', 'body'];
    fieldMap.forEach((field) => {
      const val = data[field];
      if (val === null || val === undefined) return;
      if (field === 'tags' && Array.isArray(val)) {
        setValue('tags', val.join(', '));
      } else if (field === 'date_published') {
        try { setValue('date_published', new Date(val).toISOString().split('T')[0]); } catch { setValue('date_published', val); }
      } else if (field === 'body') {
        setBody(val);
        setValue('body', val);
      } else {
        setValue(field, val);
      }
    });
    // Handle category → not in schema but in DB; set via tags or ignore if no form field
    setJsonImportModalOpen(false);
    setJsonText('');
    setJsonError('');
    setPendingJsonData(null);
    toast.success('Blog fields populated from JSON. Review and save when ready.');
  };

  const handleJsonImport = () => {
    setJsonError('');
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setJsonError('Invalid JSON. Please check your formatting and try again.');
      return;
    }
    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
      setJsonError('Invalid JSON. Expected an object, not an array.');
      return;
    }
    if (isDirty) {
      setPendingJsonData(parsed);
      setConfirmOverwriteOpen(true);
    } else {
      applyJsonToForm(parsed);
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

  const emojiCommand: ICommand = { 
    name: 'emoji', 
    keyCommand: 'emoji', 
    buttonProps: { 'aria-label': 'Emoji', title: 'Insert emoji' }, 
    icon: (
      <span
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
          if (textarea) {
            setCursorPosition(textarea.selectionStart);
          }
          setShowEmojiPicker(!showEmojiPicker);
        }}
        style={{ cursor: 'pointer' }}
      >
        <Smile size={14} />
      </span>
    ), 
    execute: () => {} 
  };
  
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

  const tableCommand: ICommand = { name: 'table', keyCommand: 'table', buttonProps: { 'aria-label': 'Insert table', title: 'Insert table' }, icon: (<TableBuilder onInsert={(markdown) => { setBody((prev) => prev + '\n\n' + markdown + '\n\n'); }} />) };

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

  const previewData = useMemo(() => ({ title: formData.title || 'Untitled', subtitle: formData.subtitle || '', author: formData.author || 'Aimee Farabee', body, banner_image: formData.banner_image, excerpt: formData.excerpt || '', date_published: new Date(formData.date_published || new Date().toISOString()) }), [formData, body]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setViewMode('edit');
    } else {
      setViewMode('split');
    }
  };

  return (
    <PasswordGate>
      <AboutBackground />
      <div className="min-h-screen bg-background w-full">
      {!isFullScreen && (
        <div className="border-b border-border bg-card"><div className="max-w-[1800px] mx-auto px-6 py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><Button variant="ghost" size="sm" onClick={handleBackClick}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button><h1 className="text-2xl font-bold">{blogId ? 'Edit Blog' : 'New Blog'}</h1></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { setJsonText(''); setJsonError(''); setJsonImportModalOpen(true); }}><FileUp className="w-4 h-4 mr-2" />Import JSON</Button><Button variant="outline" size="sm" onClick={cleanAllHtml} title="Strip legacy HTML formatting from content"><RemoveFormatting className="w-4 h-4 mr-2" />Clean HTML</Button><Button variant={viewMode === 'edit' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('edit')}>Edit</Button><Button variant="outline" size="sm" onClick={saveDraft}><Save className="w-4 h-4 mr-2" />Save Draft</Button><Button variant={viewMode === 'split' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('split')}>Split</Button><Button variant={viewMode === 'preview' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('preview')}><Eye className="w-4 h-4 mr-2" />Preview</Button><Button variant="outline" size="sm" onClick={toggleFullScreen} title="Focus mode"><Maximize2 className="w-4 h-4" /></Button></div></div></div></div>
      )}
      {isFullScreen && (
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold">{blogId ? 'Edit Blog' : 'New Blog'} - Focus Mode</h1>
            <Button variant="outline" size="sm" onClick={toggleFullScreen} title="Exit focus mode">
              <Minimize2 className="w-4 h-4 mr-2" />Exit Focus Mode
            </Button>
          </div>
        </div>
      )}
      <div className={isFullScreen ? "pt-16" : ""}><div className={isFullScreen ? "max-w-5xl mx-auto p-6" : "max-w-[1800px] mx-auto p-6"}><div className={isFullScreen ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="space-y-6"><div className="space-y-6">
            <div><Label htmlFor="title">Title *</Label><Input id="title" {...register('title')} className="mt-1" />{errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}</div>
            <div><Label htmlFor="subtitle">Subtitle</Label><Input id="subtitle" {...register('subtitle')} className="mt-1" /></div>
            <div><Label htmlFor="excerpt">Excerpt (150 characters or less) *</Label><Textarea id="excerpt" {...register('excerpt')} className="mt-1" rows={3} />{errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>}</div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Content *</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setImageModalOpen(true)}>
                  <Image className="w-4 h-4 mr-2" />Insert Image
                </Button>
              </div>
              <div className="relative">
                <EditableTableWrapper body={body} onBodyUpdate={setBody}>
                  <MDEditor 
                    value={body} 
                    onChange={(val) => setBody(val || '')} 
                    height={400} 
                    preview="edit" 
                    commands={editorCommands}
                    textareaProps={{
                      onKeyDown: (e) => handleListKeyDown(e, body, setBody)
                    }}
                  />
                </EditableTableWrapper>
                {showEmojiPicker && (
                  <div className="absolute z-50 top-12 right-0">
                    <EmojiPicker onEmojiClick={(emojiData: EmojiClickData) => { setBody(prev => prev.substring(0, cursorPosition) + emojiData.emoji + prev.substring(cursorPosition)); setShowEmojiPicker(false); }} theme={Theme.DARK} />
                  </div>
                )}
              </div>
            </div>
            <div><Label htmlFor="author">Author</Label><Input id="author" {...register('author')} className="mt-1" /></div>
            <div><Label htmlFor="slug">Slug *</Label><Input id="slug" {...register('slug')} className="mt-1" />{errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}{blogId && watchedSlug && (<div className="mt-2"><Label>LinkedIn Share URL</Label><LinkedInShareField slug={watchedSlug} type="blog" /></div>)}</div>
            <div><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" {...register('tags')} className="mt-1" placeholder="AI, Technology, Tutorial" /></div>
            <div>
              <Label htmlFor="banner_image">Banner Image URL</Label>
              <div className="flex gap-2 mt-1">
                <Input id="banner_image" {...register('banner_image')} />
                <Button type="button" variant="outline" onClick={() => setIsAssetPickerOpen(true)}>
                  Library
                </Button>
              </div>
              {formData.banner_image && (
                <div className="mt-2">
                  <img src={formData.banner_image} alt="Banner preview" className="w-full h-48 object-cover rounded-md border border-border" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Status</Label><Badge variant={formData.status === 'draft' ? 'outline' : 'default'} className="mt-2">{formData.status?.toUpperCase()}</Badge></div><div><Label htmlFor="date_published">Publish Date</Label><Input id="date_published" type="date" {...register('date_published')} className="mt-1" /></div></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveDraft} variant="outline"><Save className="w-4 h-4 mr-2" />Save Draft</Button>
            {formData.status === 'draft' && <Button onClick={publishBlog}>Publish Now</Button>}
            {formData.status === 'published' && (
              <>
                <Button onClick={updatePublished} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />Update Published
                </Button>
                <Button onClick={unpublishBlog} variant="outline">Unpublish</Button>
              </>
            )}
            {formData.status === 'archived' && <Button onClick={restoreBlog} variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Restore</Button>}
            <Button onClick={() => setArchiveDialogOpen(true)} variant="outline"><Trash2 className="w-4 h-4 mr-2" />Archive</Button>
            <Button onClick={handleClearClick} variant="ghost">Clear</Button>
          </div></div>
        )}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="h-[calc(100vh-200px)] overflow-y-auto"><BlogPreview {...previewData} /></div>
        )}
      </div></div></div>
      <ImageUploadModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} onInsert={(url, alt) => { setBody(prev => `${prev}\n\n![${alt}](${url})\n\n`); setImageModalOpen(false); }} />
      <ImageUploadModal open={cursorImageModalOpen} onClose={() => setCursorImageModalOpen(false)} onInsert={(url, alt) => { const imageMarkdown = `![${alt}](${url})`; setBody(prev => prev.substring(0, cursorPosition) + imageMarkdown + prev.substring(cursorPosition)); setCursorImageModalOpen(false); }} />
      <AssetPicker open={isAssetPickerOpen} onClose={() => setIsAssetPickerOpen(false)} onSelect={(url) => { setValue('banner_image', url); setIsAssetPickerOpen(false); }} />
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Archive Blog?</AlertDialogTitle><AlertDialogDescription>This will change the status to Archived.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={archiveBlog}>Archive</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Clear form?</AlertDialogTitle><AlertDialogDescription>All unsaved changes will be lost.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleClearForm}>Clear</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showNavigateAwayDialog} onOpenChange={setShowNavigateAwayDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Unsaved Changes</AlertDialogTitle><AlertDialogDescription>You have unsaved changes. What would you like to do?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter className="flex-col sm:flex-row gap-2"><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => navigate('/admin/blogs')} className="bg-destructive hover:bg-destructive/90">Exit Without Saving</AlertDialogAction><AlertDialogAction onClick={async () => { await saveDraft(); navigate('/admin/blogs'); }}>Save Changes</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <Dialog open={jsonImportModalOpen} onOpenChange={setJsonImportModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import from JSON</DialogTitle>
          </DialogHeader>
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
            <Textarea
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setJsonError(''); }}
              rows={10}
              placeholder='{ "title": "My Blog", "body": "..." }'
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Accepted fields: slug, title, subtitle, author, category, tags, date_published, status, excerpt, banner_image, body
            </p>
            {jsonError && <p className="text-sm text-destructive font-medium">{jsonError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJsonImportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleJsonImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmOverwriteOpen} onOpenChange={setConfirmOverwriteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace form values?</AlertDialogTitle>
            <AlertDialogDescription>This will replace the current form values with the imported JSON data. Continue?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingJsonData(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (pendingJsonData) applyJsonToForm(pendingJsonData); setConfirmOverwriteOpen(false); }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </PasswordGate>
  );
}
