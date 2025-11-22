import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, Image, Save, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Smile, Palette, Underline } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import ProjectPreview from '@/components/admin/ProjectPreview';
import ImageUploadModal from '@/components/admin/ImageUploadModal';
import ImageUploadHelper from '@/components/admin/ImageUploadHelper';
import AssetPicker from '@/components/admin/AssetPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAutosave } from '@/hooks/useAutosave';

const projectSchema = z.object({
  project_title: z.string().min(1, 'Title required').max(200),
  subtitle: z.string().min(1, 'Subtitle required').max(200),
  body: z.string().min(1, 'Content required'),
  technologies: z.string().min(1, 'At least one technology required'),
  thumbnail: z.string().url().optional().or(z.literal('')),
  github_link: z.string().url().optional().or(z.literal('')),
  project_page_link: z.string().url().optional().or(z.literal('')),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).default('Draft'),
  display_order: z.number().default(0),
  date_published: z.string(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

// Custom commands
const fontSizeSmall: ICommand = { name: 'fontSizeSmall', keyCommand: 'fontSizeSmall', buttonProps: { 'aria-label': 'Small text' }, icon: <span style={{ fontSize: '12px', fontWeight: 'bold' }}>S</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 14px;">${state.selectedText || 'text'}</span>`) };
const fontSizeNormal: ICommand = { name: 'fontSizeNormal', keyCommand: 'fontSizeNormal', buttonProps: { 'aria-label': 'Normal text' }, icon: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>M</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 16px;">${state.selectedText || 'text'}</span>`) };
const fontSizeLarge: ICommand = { name: 'fontSizeLarge', keyCommand: 'fontSizeLarge', buttonProps: { 'aria-label': 'Large text' }, icon: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>L</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 20px;">${state.selectedText || 'text'}</span>`) };
const fontSizeXL: ICommand = { name: 'fontSizeXL', keyCommand: 'fontSizeXL', buttonProps: { 'aria-label': 'XL text' }, icon: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>XL</span>, execute: (state, api) => api.replaceSelection(`<span style="font-size: 24px;">${state.selectedText || 'text'}</span>`) };
const colorBlack: ICommand = { name: 'colorBlack', keyCommand: 'colorBlack', buttonProps: { 'aria-label': 'Black text' }, icon: <span style={{ color: '#000000', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #000000;">${state.selectedText || 'text'}</span>`) };
const colorCyan: ICommand = { name: 'colorCyan', keyCommand: 'colorCyan', buttonProps: { 'aria-label': 'Cyan text (brand)' }, icon: <span style={{ color: '#00D4FF', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #00D4FF;">${state.selectedText || 'text'}</span>`) };
const colorPink: ICommand = { name: 'colorPink', keyCommand: 'colorPink', buttonProps: { 'aria-label': 'Pink text (brand)' }, icon: <span style={{ color: '#FF0080', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #FF0080;">${state.selectedText || 'text'}</span>`) };
const colorGray: ICommand = { name: 'colorGray', keyCommand: 'colorGray', buttonProps: { 'aria-label': 'Gray text (muted)' }, icon: <span style={{ color: '#6B7280', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #6B7280;">${state.selectedText || 'text'}</span>`) };
const colorRed: ICommand = { name: 'colorRed', keyCommand: 'colorRed', buttonProps: { 'aria-label': 'Red text (emphasis)' }, icon: <span style={{ color: '#EF4444', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #EF4444;">${state.selectedText || 'text'}</span>`) };
const colorGreen: ICommand = { name: 'colorGreen', keyCommand: 'colorGreen', buttonProps: { 'aria-label': 'Green text (success)' }, icon: <span style={{ color: '#10B981', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #10B981;">${state.selectedText || 'text'}</span>`) };
const colorYellow: ICommand = { name: 'colorYellow', keyCommand: 'colorYellow', buttonProps: { 'aria-label': 'Yellow text (accent)' }, icon: <span style={{ color: '#f9f940', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #f9f940;">${state.selectedText || 'text'}</span>`) };
const colorBlue: ICommand = { name: 'colorBlue', keyCommand: 'colorBlue', buttonProps: { 'aria-label': 'Blue text (info)' }, icon: <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>A</span>, execute: (state, api) => api.replaceSelection(`<span style="color: #3B82F6;">${state.selectedText || 'text'}</span>`) };
const alignLeft: ICommand = { name: 'alignLeft', keyCommand: 'alignLeft', buttonProps: { 'aria-label': 'Align left' }, icon: <AlignLeft size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: left;">${state.selectedText || 'text'}</div>`) };
const alignCenter: ICommand = { name: 'alignCenter', keyCommand: 'alignCenter', buttonProps: { 'aria-label': 'Align center' }, icon: <AlignCenter size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: center;">${state.selectedText || 'text'}</div>`) };
const alignRight: ICommand = { name: 'alignRight', keyCommand: 'alignRight', buttonProps: { 'aria-label': 'Align right' }, icon: <AlignRight size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: right;">${state.selectedText || 'text'}</div>`) };
const alignJustify: ICommand = { name: 'alignJustify', keyCommand: 'alignJustify', buttonProps: { 'aria-label': 'Justify' }, icon: <AlignJustify size={14} />, execute: (state, api) => api.replaceSelection(`<div style="text-align: justify;">${state.selectedText || 'text'}</div>`) };
const underline: ICommand = { name: 'underline', keyCommand: 'underline', buttonProps: { 'aria-label': 'Underline text', title: 'Underline text' }, icon: <Underline size={14} />, execute: (state, api) => api.replaceSelection(`<u>${state.selectedText || 'text'}</u>`) };

export default function ProjectEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(searchParams.get('id'));
  const [body, setBody] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: 'Draft', display_order: 0, date_published: new Date().toISOString().split('T')[0] },
  });

  const formData = watch();

  useEffect(() => {
    if (projectId) {
      (async () => {
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (!error && data) {
          reset({ project_title: data.project_title, subtitle: data.subtitle, body: data.body, technologies: data.technologies.join(', '), thumbnail: data.thumbnail || '', github_link: data.github_link || '', project_page_link: data.project_page_link || '', status: data.status as any, display_order: data.display_order, date_published: new Date(data.date_published).toISOString().split('T')[0] });
          setBody(data.body);
        }
        setLoading(false);
      })();
    }
  }, [projectId]);

  const saveDraft = async (data: ProjectFormData) => {
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: 'Draft', display_order: data.display_order, date_published: data.date_published };
    if (projectId) await supabase.from('projects').update(payload).eq('id', projectId);
    else { const { data: newProj } = await supabase.from('projects').insert([payload]).select().single(); if (newProj) { setProjectId(newProj.id); navigate(`/admin/project-editor?id=${newProj.id}`, { replace: true }); } }
  };

  useAutosave(formData, saveDraft, 30000);

  const onSubmit = async (data: ProjectFormData) => {
    const techs = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { project_title: data.project_title, subtitle: data.subtitle, body, technologies: techs, thumbnail: data.thumbnail || null, github_link: data.github_link || null, project_page_link: data.project_page_link || null, status: data.status, display_order: data.display_order, date_published: data.status === 'Active' ? data.date_published : new Date().toISOString() };
    if (projectId) { await supabase.from('projects').update(payload).eq('id', projectId); toast.success('Updated'); }
    else { const { data: newProj } = await supabase.from('projects').insert([payload]).select().single(); setProjectId(newProj.id); toast.success('Created'); navigate(`/admin/project-editor?id=${newProj.id}`, { replace: true }); }
  };

  const handleDelete = async () => { if (projectId) { await supabase.from('projects').delete().eq('id', projectId); toast.success('Deleted'); navigate('/admin/projects'); } };
  const handleClearForm = () => { reset({ project_title: '', subtitle: '', body: '', technologies: '', thumbnail: '', github_link: '', project_page_link: '', status: 'Draft', display_order: 0, date_published: new Date().toISOString().split('T')[0] }); setBody(''); setProjectId(null); navigate('/admin/project-editor', { replace: true }); setClearDialogOpen(false); };
  const emojiCommand: ICommand = { name: 'emoji', keyCommand: 'emoji', buttonProps: { 'aria-label': 'Emoji' }, icon: <Smile size={14} />, execute: () => setShowEmojiPicker(!showEmojiPicker) };
  
  const fontSizeGroup = commands.group([fontSizeSmall, fontSizeNormal, fontSizeLarge, fontSizeXL], {
    name: 'fontSize',
    groupName: 'fontSize',
    buttonProps: { 'aria-label': 'Font size' },
    icon: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>A</span>,
  });

  const textColorGroup = commands.group([colorBlack, colorCyan, colorPink, colorGray, colorRed, colorGreen, colorYellow, colorBlue], {
    name: 'textColor',
    groupName: 'textColor',
    buttonProps: { 'aria-label': 'Text color' },
    icon: <Palette size={14} />,
  });

  const textAlignGroup = commands.group([alignLeft, alignCenter, alignRight, alignJustify], {
    name: 'textAlign',
    groupName: 'textAlign',
    buttonProps: { 'aria-label': 'Text alignment' },
    icon: <AlignLeft size={14} />,
  });

  const editorCommands = [commands.bold, commands.italic, underline, commands.strikethrough, commands.divider, commands.title, commands.divider, fontSizeGroup, textColorGroup, textAlignGroup, commands.divider, commands.link, commands.quote, commands.code, commands.divider, commands.unorderedListCommand, commands.orderedListCommand, commands.divider, emojiCommand];

  const previewData = useMemo(() => ({ title: formData.project_title || 'Untitled', subtitle: formData.subtitle || '', body, thumbnail: formData.thumbnail, technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) : [], githubLink: formData.github_link, projectPageLink: formData.project_page_link, publishDate: formData.date_published || new Date().toISOString(), status: formData.status }), [formData, body]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card"><div className="max-w-[1800px] mx-auto px-6 py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><Button variant="ghost" size="sm" onClick={() => navigate('/admin/project-dashboard')}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button><h1 className="text-2xl font-bold">{projectId ? 'Edit Project' : 'New Project'}</h1></div><div className="flex gap-2"><Button variant={viewMode === 'edit' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('edit')}>Edit</Button><Button variant={viewMode === 'split' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('split')}>Split</Button><Button variant={viewMode === 'preview' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('preview')}><Eye className="w-4 h-4 mr-2" />Preview</Button></div></div></div></div>
      <div className="max-w-[1800px] mx-auto p-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="space-y-6"><form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div><Label>Title *</Label><Input {...register('project_title')} />{errors.project_title && <p className="text-sm text-destructive mt-1">{errors.project_title.message}</p>}</div>
            <div><Label>Subtitle *</Label><Input {...register('subtitle')} />{errors.subtitle && <p className="text-sm text-destructive mt-1">{errors.subtitle.message}</p>}</div>
            <div><Label>Technologies *</Label><Input {...register('technologies')} placeholder="React, TypeScript" />{errors.technologies && <p className="text-sm text-destructive mt-1">{errors.technologies.message}</p>}</div>
            <div><Label>Thumbnail</Label><div className="flex gap-2"><Input {...register('thumbnail')} /><Button type="button" variant="outline" onClick={() => setIsAssetPickerOpen(true)}>Library</Button></div>{formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-2" />}<ImageUploadHelper onBannerInsert={(url) => setValue('thumbnail', url)} onBodyInsert={(markdown) => setBody(prev => `${prev}\n\n${markdown}\n\n`)} /></div>
            <div><div className="flex justify-between mb-2"><Label>Content *</Label><Button type="button" variant="outline" size="sm" onClick={() => setImageModalOpen(true)}><Image className="w-4 h-4 mr-2" />Insert Image</Button></div><div data-color-mode="dark"><MDEditor value={body} onChange={(val) => setBody(val || '')} commands={editorCommands} height={500} preview="edit" /></div>{showEmojiPicker && <div className="absolute z-50 mt-2"><EmojiPicker onEmojiClick={(e) => { setBody(prev => `${prev}${e.emoji}`); setShowEmojiPicker(false); }} theme={Theme.DARK} /></div>}</div>
            <div className="grid grid-cols-2 gap-4"><div><Label>GitHub</Label><Input {...register('github_link')} /></div><div><Label>Demo</Label><Input {...register('project_page_link')} /></div></div>
            <div className="grid grid-cols-3 gap-4"><div><Label>Status</Label><Select value={formData.status} onValueChange={(v) => setValue('status', v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Archived">Archived</SelectItem></SelectContent></Select></div><div><Label>Order</Label><Input type="number" {...register('display_order', { valueAsNumber: true })} /></div><div><Label>Date</Label><Input type="date" {...register('date_published')} /></div></div>
            <div className="flex gap-2"><Button type="submit"><Save className="w-4 h-4 mr-2" />{formData.status === 'Active' ? 'Publish' : 'Save'}</Button>{projectId && formData.status !== 'Active' && <Button type="button" onClick={() => { setValue('status', 'Active'); handleSubmit(onSubmit)(); }}>Publish Now</Button>}{projectId && formData.status === 'Active' && <Button type="button" variant="outline" onClick={() => { setValue('status', 'Draft'); handleSubmit(onSubmit)(); }}>Unpublish</Button>}<Button type="button" variant="outline" onClick={() => setClearDialogOpen(true)}>Clear</Button>{projectId && <Button type="button" variant="destructive" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>}</div>
          </form></div>
        )}
        {(viewMode === 'split' || viewMode === 'preview') && <div className="lg:sticky lg:top-6 h-[calc(100vh-120px)]"><div className="border rounded-lg overflow-hidden h-full"><ProjectPreview {...previewData} /></div></div>}
      </div></div>
      <ImageUploadModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} onInsert={(url, alt) => { setBody(prev => `${prev}\n\n![${alt}](${url})\n\n`); setImageModalOpen(false); }} />
      <AssetPicker open={isAssetPickerOpen} onClose={() => setIsAssetPickerOpen(false)} onSelect={(url) => { setValue('thumbnail', url); setIsAssetPickerOpen(false); }} />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Project</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Clear Form</AlertDialogTitle><AlertDialogDescription>All unsaved changes will be lost.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleClearForm}>Clear</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
