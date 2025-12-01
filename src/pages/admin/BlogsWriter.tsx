import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, Image, Save, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Smile, Palette, Underline, RotateCcw } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import BlogPreview from '@/components/admin/BlogPreview';
import ImageUploadModal from '@/components/admin/ImageUploadModal';
import ImageUploadHelper from '@/components/admin/ImageUploadHelper';
import AssetPicker from '@/components/admin/AssetPicker';
import { TableBuilder } from '@/components/admin/TableBuilder';
import { EditableTableWrapper } from '@/components/admin/EditableTableWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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

// Custom commands (same as ProjectEditor)
const fontSizeSmall: ICommand = { name: 'fontSizeSmall', keyCommand: 'fontSizeSmall', buttonProps: { 'aria-label': 'Small text', title: 'Small text' }, icon: <span style={{ fontSize: '12px', fontWeight: 'bold' }}>S</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 14px;">${state.selectedText || 'text'}</span>`) };
const fontSizeNormal: ICommand = { name: 'fontSizeNormal', keyCommand: 'fontSizeNormal', buttonProps: { 'aria-label': 'Normal text', title: 'Normal text' }, icon: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>M</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 16px;">${state.selectedText || 'text'}</span>`) };
const fontSizeLarge: ICommand = { name: 'fontSizeLarge', keyCommand: 'fontSizeLarge', buttonProps: { 'aria-label': 'Large text', title: 'Large text' }, icon: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>L</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 20px;">${state.selectedText || 'text'}</span>`) };
const fontSizeXL: ICommand = { name: 'fontSizeXL', keyCommand: 'fontSizeXL', buttonProps: { 'aria-label': 'XL text', title: 'Extra large text' }, icon: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>XL</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 24px;">${state.selectedText || 'text'}</span>`) };
const colorBlack: ICommand = { name: 'colorBlack', keyCommand: 'colorBlack', buttonProps: { 'aria-label': 'Black text', title: 'Black text' }, icon: <span style={{ color: '#000000', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #000000;">${state.selectedText || 'text'}</span>`) };
const colorCyan: ICommand = { name: 'colorCyan', keyCommand: 'colorCyan', buttonProps: { 'aria-label': 'Cyan text (brand)', title: 'Cyan text (brand)' }, icon: <span style={{ color: '#00D4FF', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #00D4FF;">${state.selectedText || 'text'}</span>`) };
const colorPink: ICommand = { name: 'colorPink', keyCommand: 'colorPink', buttonProps: { 'aria-label': 'Pink text (brand)', title: 'Pink text (brand)' }, icon: <span style={{ color: '#FF0080', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #FF0080;">${state.selectedText || 'text'}</span>`) };
const colorGray: ICommand = { name: 'colorGray', keyCommand: 'colorGray', buttonProps: { 'aria-label': 'Gray text (muted)', title: 'Gray text (muted)' }, icon: <span style={{ color: '#6B7280', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #6B7280;">${state.selectedText || 'text'}</span>`) };
const colorRed: ICommand = { name: 'colorRed', keyCommand: 'colorRed', buttonProps: { 'aria-label': 'Red text (emphasis)', title: 'Red text (emphasis)' }, icon: <span style={{ color: '#EF4444', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #EF4444;">${state.selectedText || 'text'}</span>`) };
const colorGreen: ICommand = { name: 'colorGreen', keyCommand: 'colorGreen', buttonProps: { 'aria-label': 'Green text (success)', title: 'Green text (success)' }, icon: <span style={{ color: '#10B981', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #10B981;">${state.selectedText || 'text'}</span>`) };
const colorYellow: ICommand = { name: 'colorYellow', keyCommand: 'colorYellow', buttonProps: { 'aria-label': 'Yellow text (accent)', title: 'Yellow text (accent)' }, icon: <span style={{ color: '#f9f940', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #f9f940;">${state.selectedText || 'text'}</span>`) };
const colorBlue: ICommand = { name: 'colorBlue', keyCommand: 'colorBlue', buttonProps: { 'aria-label': 'Blue text (info)', title: 'Blue text (info)' }, icon: <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #3B82F6;">${state.selectedText || 'text'}</span>`) };
const alignLeft: ICommand = { name: 'alignLeft', keyCommand: 'alignLeft', buttonProps: { 'aria-label': 'Align left', title: 'Align left' }, icon: <AlignLeft size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: left;">${state.selectedText || 'text'}</div>`) };
const alignCenter: ICommand = { name: 'alignCenter', keyCommand: 'alignCenter', buttonProps: { 'aria-label': 'Align center', title: 'Align center' }, icon: <AlignCenter size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: center;">${state.selectedText || 'text'}</div>`) };
const alignRight: ICommand = { name: 'alignRight', keyCommand: 'alignRight', buttonProps: { 'aria-label': 'Align right', title: 'Align right' }, icon: <AlignRight size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: right;">${state.selectedText || 'text'}</div>`) };
const alignJustify: ICommand = { name: 'alignJustify', keyCommand: 'alignJustify', buttonProps: { 'aria-label': 'Justify', title: 'Justify text' }, icon: <AlignJustify size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: justify;">${state.selectedText || 'text'}</div>`) };
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

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { status: 'draft', author: 'Aimee Farabee', date_published: new Date().toISOString().split('T')[0] },
  });

  const formData = watch();

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
    const data = watch();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug, excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'draft', date_published: data.date_published };
    if (blogId) { 
      await supabase.from('blogs').update(payload).eq('id', blogId); 
      toast.success('Draft saved');
    } else { 
      const { data: newBlog } = await supabase.from('blogs').insert([payload]).select().single(); 
      if (newBlog) { 
        setBlogId(newBlog.id); 
        navigate(`/admin/blogs/edit?id=${newBlog.id}`, { replace: true }); 
        toast.success('Draft saved');
      } 
    }
    setInitialFormData(watch());
    setInitialBody(body);
  };

  const publishBlog = async () => {
    const data = watch();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug, excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'published', date_published: new Date().toISOString() };
    if (blogId) { 
      await supabase.from('blogs').update(payload).eq('id', blogId); 
      toast.success('Blog published!');
    } else { 
      const { data: newBlog } = await supabase.from('blogs').insert([payload]).select().single(); 
      if (newBlog) { 
        setBlogId(newBlog.id); 
        navigate(`/admin/blogs/edit?id=${newBlog.id}`, { replace: true }); 
        toast.success('Blog published!');
      } 
    }
    setValue('status', 'published');
    setInitialFormData(watch());
    setInitialBody(body);
  };

  const updatePublished = async () => {
    if (!blogId) return;
    const data = watch();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug, excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'published', date_published: data.date_published };
    await supabase.from('blogs').update(payload).eq('id', blogId); 
    toast.success('Published blog updated!');
    setInitialFormData(watch());
    setInitialBody(body);
  };

  const unpublishBlog = async () => {
    if (!blogId) return;
    const data = watch();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug, excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'draft', date_published: data.date_published };
    await supabase.from('blogs').update(payload).eq('id', blogId); 
    toast.success('Blog unpublished');
    setValue('status', 'draft');
    setInitialFormData(watch());
    setInitialBody(body);
  };

  const archiveBlog = async () => {
    if (!blogId) return;
    const data = watch();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug, excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'archived', date_published: data.date_published };
    await supabase.from('blogs').update(payload).eq('id', blogId); 
    toast.success('Blog archived');
    setValue('status', 'archived');
    setArchiveDialogOpen(false);
    setInitialFormData(watch());
    setInitialBody(body);
  };

  const restoreBlog = async () => {
    if (!blogId) return;
    const data = watch();
    const payload = { title: data.title, subtitle: data.subtitle || null, author: data.author, slug: data.slug, excerpt: data.excerpt, body, tags: data.tags || null, banner_image: data.banner_image || null, status: 'published', date_published: new Date().toISOString() };
    await supabase.from('blogs').update(payload).eq('id', blogId); 
    toast.success('Blog restored to Published');
    setValue('status', 'published');
    setInitialFormData(watch());
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

  const emojiCommand: ICommand = { name: 'emoji', keyCommand: 'emoji', buttonProps: { 'aria-label': 'Emoji', title: 'Insert emoji' }, icon: <Smile size={14} />, execute: () => setShowEmojiPicker(!showEmojiPicker) };
  
  const fontSizeGroup = commands.group([fontSizeSmall, fontSizeNormal, fontSizeLarge, fontSizeXL], { name: 'fontSize', groupName: 'fontSize', buttonProps: { 'aria-label': 'Font size', title: 'Font size' }, icon: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>A</span> });
  const textColorGroup = commands.group([colorBlack, colorCyan, colorPink, colorGray, colorRed, colorGreen, colorYellow, colorBlue], { name: 'textColor', groupName: 'textColor', buttonProps: { 'aria-label': 'Text color', title: 'Text color' }, icon: <Palette size={14} /> });
  const textAlignGroup = commands.group([alignLeft, alignCenter, alignRight, alignJustify], { name: 'textAlign', groupName: 'textAlign', buttonProps: { 'aria-label': 'Text alignment', title: 'Text alignment' }, icon: <AlignLeft size={14} /> });

  const tableCommand: ICommand = { name: 'table', keyCommand: 'table', buttonProps: { 'aria-label': 'Insert table', title: 'Insert table' }, icon: (<TableBuilder onInsert={(markdown) => { setBody((prev) => prev + '\n\n' + markdown + '\n\n'); }} />) };

  const editorCommands = [commands.bold, commands.italic, underline, commands.strikethrough, commands.divider, commands.title, commands.divider, fontSizeGroup, textColorGroup, textAlignGroup, commands.divider, commands.link, commands.quote, commands.code, commands.divider, commands.unorderedListCommand, commands.orderedListCommand, commands.divider, tableCommand, commands.divider, emojiCommand];

  const previewData = useMemo(() => ({ title: formData.title || 'Untitled', subtitle: formData.subtitle || '', author: formData.author || 'Aimee Farabee', body, banner_image: formData.banner_image, excerpt: formData.excerpt || '', date_published: new Date(formData.date_published || new Date().toISOString()) }), [formData, body]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card"><div className="max-w-[1800px] mx-auto px-6 py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><Button variant="ghost" size="sm" onClick={handleBackClick}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button><h1 className="text-2xl font-bold">{blogId ? 'Edit Blog' : 'New Blog'}</h1></div><div className="flex gap-2"><Button variant={viewMode === 'edit' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('edit')}>Edit</Button><Button variant={viewMode === 'split' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('split')}>Split</Button><Button variant={viewMode === 'preview' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('preview')}><Eye className="w-4 h-4 mr-2" />Preview</Button></div></div></div></div>
      <div className="max-w-[1800px] mx-auto p-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="space-y-6"><div className="space-y-6">
            <div><Label htmlFor="title">Title *</Label><Input id="title" {...register('title')} className="mt-1" />{errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}</div>
            <div><Label htmlFor="subtitle">Subtitle</Label><Input id="subtitle" {...register('subtitle')} className="mt-1" /></div>
            <div><Label htmlFor="excerpt">Excerpt *</Label><Textarea id="excerpt" {...register('excerpt')} className="mt-1" rows={3} />{errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>}</div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Content *</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setImageModalOpen(true)}>
                  <Image className="w-4 h-4 mr-2" />Insert Image
                </Button>
              </div>
              <div className="relative">
                <EditableTableWrapper body={body} onBodyUpdate={setBody}>
                  <MDEditor value={body} onChange={(val) => setBody(val || '')} height={400} preview="edit" commands={editorCommands} />
                </EditableTableWrapper>
                {showEmojiPicker && (
                  <div className="absolute z-50 top-12 right-0">
                    <EmojiPicker onEmojiClick={(emojiData: EmojiClickData) => { setBody(prev => prev + emojiData.emoji); setShowEmojiPicker(false); }} theme={Theme.DARK} />
                  </div>
                )}
              </div>
            </div>
            <ImageUploadHelper 
              onBannerInsert={(url) => setValue('banner_image', url)} 
              onBodyInsert={(markdown) => setBody(prev => `${prev}\n\n${markdown}\n\n`)} 
            />
            <div><Label htmlFor="author">Author</Label><Input id="author" {...register('author')} className="mt-1" /></div>
            <div><Label htmlFor="slug">Slug *</Label><Input id="slug" {...register('slug')} className="mt-1" />{errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}</div>
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
      </div></div>
      <ImageUploadModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} onInsert={(url, alt) => { setBody(prev => `${prev}\n\n![${alt}](${url})\n\n`); setImageModalOpen(false); }} />
      <AssetPicker open={isAssetPickerOpen} onClose={() => setIsAssetPickerOpen(false)} onSelect={(url) => { setValue('banner_image', url); setIsAssetPickerOpen(false); }} />
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Archive Blog?</AlertDialogTitle><AlertDialogDescription>This will change the status to Archived.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={archiveBlog}>Archive</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Clear form?</AlertDialogTitle><AlertDialogDescription>All unsaved changes will be lost.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleClearForm}>Clear</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showNavigateAwayDialog} onOpenChange={setShowNavigateAwayDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Unsaved changes</AlertDialogTitle><AlertDialogDescription>You have unsaved changes. Leave anyway?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Stay</AlertDialogCancel><AlertDialogAction onClick={() => navigate('/admin/blogs')}>Leave</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
