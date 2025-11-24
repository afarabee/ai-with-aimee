import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, Image, Save, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette, Smile, Underline, RotateCcw } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import BlogPreview from '@/components/admin/BlogPreview';
import ImageUploadModal from '@/components/admin/ImageUploadModal';
import ImageUploadHelper from '@/components/admin/ImageUploadHelper';
import AssetPicker from '@/components/admin/AssetPicker';
import { TableBuilder } from '@/components/admin/TableBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
const blogSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  subtitle: z.string().max(200).optional(),
  author: z.string().default('Aimee Farabee'),
  slug: z.string().min(1, 'Slug required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  excerpt: z.string().min(1, 'Excerpt required').max(500),
  category: z.string().optional(),
  tags: z.string().optional(),
  banner_image: z.string().url().optional().or(z.literal('')),
  body: z.string().min(1, 'Content required'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  date_published: z.string(),
});

type BlogFormData = z.infer<typeof blogSchema>;

// Custom font size commands
const fontSizeSmall: ICommand = {
  name: 'fontSizeSmall',
  keyCommand: 'fontSizeSmall',
  buttonProps: { 'aria-label': 'Small text', title: 'Small (14px)' },
  icon: <span style={{ fontSize: '12px', fontWeight: 'bold' }}>S</span>,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'small text';
    api.replaceSelection(`<span style="font-size: 14px;">${selectedText}</span>`);
  },
};

const fontSizeNormal: ICommand = {
  name: 'fontSizeNormal',
  keyCommand: 'fontSizeNormal',
  buttonProps: { 'aria-label': 'Normal text', title: 'Normal (16px)' },
  icon: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>M</span>,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'normal text';
    api.replaceSelection(`<span style="font-size: 16px;">${selectedText}</span>`);
  },
};

const fontSizeLarge: ICommand = {
  name: 'fontSizeLarge',
  keyCommand: 'fontSizeLarge',
  buttonProps: { 'aria-label': 'Large text', title: 'Large (20px)' },
  icon: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>L</span>,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'large text';
    api.replaceSelection(`<span style="font-size: 20px;">${selectedText}</span>`);
  },
};

const fontSizeExtraLarge: ICommand = {
  name: 'fontSizeXL',
  keyCommand: 'fontSizeXL',
  buttonProps: { 'aria-label': 'Extra large text', title: 'Extra Large (24px)' },
  icon: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>XL</span>,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'extra large text';
    api.replaceSelection(`<span style="font-size: 24px;">${selectedText}</span>`);
  },
};


// Text color commands
const colorBlack: ICommand = {
  name: 'colorBlack',
  keyCommand: 'colorBlack',
  buttonProps: { 'aria-label': 'Black text', title: 'Black text' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#000000', border: '1px solid #ccc', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #000000;">${selectedText}</span>`);
  },
};

const colorCyan: ICommand = {
  name: 'colorCyan',
  keyCommand: 'colorCyan',
  buttonProps: { 'aria-label': 'Cyan text', title: 'Cyan text (brand color)' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#00D4FF', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #00D4FF;">${selectedText}</span>`);
  },
};

const colorPink: ICommand = {
  name: 'colorPink',
  keyCommand: 'colorPink',
  buttonProps: { 'aria-label': 'Pink text', title: 'Pink text (brand color)' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#FF0080', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #FF0080;">${selectedText}</span>`);
  },
};

const colorGray: ICommand = {
  name: 'colorGray',
  keyCommand: 'colorGray',
  buttonProps: { 'aria-label': 'Gray text', title: 'Gray text (muted)' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#6B7280', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #6B7280;">${selectedText}</span>`);
  },
};

const colorRed: ICommand = {
  name: 'colorRed',
  keyCommand: 'colorRed',
  buttonProps: { 'aria-label': 'Red text', title: 'Red text (emphasis)' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#EF4444', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #EF4444;">${selectedText}</span>`);
  },
};

const colorGreen: ICommand = {
  name: 'colorGreen',
  keyCommand: 'colorGreen',
  buttonProps: { 'aria-label': 'Green text', title: 'Green text (success)' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#10B981', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #10B981;">${selectedText}</span>`);
  },
};

const colorYellow: ICommand = {
  name: 'colorYellow',
  keyCommand: 'colorYellow',
  buttonProps: { 'aria-label': 'Yellow text', title: 'Yellow text (accent)' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#f9f940', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #f9f940;">${selectedText}</span>`);
  },
};

const colorBlue: ICommand = {
  name: 'colorBlue',
  keyCommand: 'colorBlue',
  buttonProps: { 'aria-label': 'Blue text', title: 'Blue text (info)' },
  icon: <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#3B82F6', borderRadius: '2px' }} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<span style="color: #3B82F6;">${selectedText}</span>`);
  },
};


// Text alignment commands
const alignLeft: ICommand = {
  name: 'alignLeft',
  keyCommand: 'alignLeft',
  buttonProps: { 'aria-label': 'Align left', title: 'Align left' },
  icon: <AlignLeft size={14} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<div style="text-align: left;">${selectedText}</div>`);
  },
};

const alignCenter: ICommand = {
  name: 'alignCenter',
  keyCommand: 'alignCenter',
  buttonProps: { 'aria-label': 'Align center', title: 'Align center' },
  icon: <AlignCenter size={14} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<div style="text-align: center;">${selectedText}</div>`);
  },
};

const alignRight: ICommand = {
  name: 'alignRight',
  keyCommand: 'alignRight',
  buttonProps: { 'aria-label': 'Align right', title: 'Align right' },
  icon: <AlignRight size={14} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<div style="text-align: right;">${selectedText}</div>`);
  },
};

const alignJustify: ICommand = {
  name: 'alignJustify',
  keyCommand: 'alignJustify',
  buttonProps: { 'aria-label': 'Justify', title: 'Justify text' },
  icon: <AlignJustify size={14} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<div style="text-align: justify;">${selectedText}</div>`);
  },
};

const underline: ICommand = {
  name: 'underline',
  keyCommand: 'underline',
  buttonProps: { 'aria-label': 'Underline text', title: 'Underline text' },
  icon: <Underline size={14} />,
  execute: (state, api) => {
    const selectedText = state.selectedText || 'text';
    api.replaceSelection(`<u>${selectedText}</u>`);
  },
};

// Emoji picker command will be created inside the component to access state


export default function BlogEditor() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const blogIdFromUrl = searchParams.get('id');
  const navigate = useNavigate();
  const [blogId, setBlogId] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [showNavigateAwayDialog, setShowNavigateAwayDialog] = useState(false);
  const [initialFormData, setInitialFormData] = useState<BlogFormData | null>(null);
  const [initialBody, setInitialBody] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      author: 'Aimee Farabee',
      status: 'draft',
      date_published: new Date().toISOString().split('T')[0],
    },
  });

  const formData = watch();

  // Generate slug from title
  useEffect(() => {
    if (formData.title && !slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', generatedSlug);
    }
  }, [formData.title, slug, setValue]);

  // Load existing post if editing
  useEffect(() => {
    if (blogIdFromUrl) {
      loadPostById(blogIdFromUrl);
    } else if (slug) {
      loadPost(slug);
    }
  }, [blogIdFromUrl, slug]);

  const isDirty = useMemo(() => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData) || body !== initialBody;
  }, [formData, body, initialFormData, initialBody]);

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

  const loadPost = async (postSlug: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', postSlug)
        .single();

      if (error) throw error;

      if (data) {
        setBlogId(data.id);
        const formData = {
          title: data.title,
          subtitle: data.subtitle || '',
          author: data.author || 'Aimee Farabee',
          slug: data.slug,
          excerpt: data.excerpt,
          category: data.category || '',
          tags: data.tags || '',
          banner_image: data.banner_image || '',
          body: data.body,
          status: (data.status || 'draft') as 'draft' | 'published' | 'archived',
          date_published: new Date(data.date_published).toISOString().split('T')[0],
        };
        reset(formData);
        setBody(data.body);
        setInitialFormData(formData);
        setInitialBody(data.body);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadPostById = async (postId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      if (data) {
        setBlogId(data.id);
        const formData = {
          title: data.title,
          subtitle: data.subtitle || '',
          author: data.author || 'Aimee Farabee',
          slug: data.slug,
          excerpt: data.excerpt,
          category: data.category || '',
          tags: data.tags || '',
          banner_image: data.banner_image || '',
          body: data.body,
          status: (data.status || 'draft') as 'draft' | 'published' | 'archived',
          date_published: new Date(data.date_published).toISOString().split('T')[0],
        };
        reset(formData);
        setBody(data.body);
        setInitialFormData(formData);
        setInitialBody(data.body);
      }
    } catch (error) {
      console.error('Error loading post by ID:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    const data = watch();
    try {
      const postData = {
        title: data.title,
        subtitle: data.subtitle || null,
        author: data.author,
        slug: data.slug,
        excerpt: data.excerpt,
        category: data.category || null,
        tags: data.tags || null,
        banner_image: data.banner_image || null,
        body,
        status: 'draft',
        date_published: new Date(data.date_published).toISOString(),
      };

      if (blogId) {
        const { error } = await supabase.from('blogs').update(postData).eq('id', blogId);
        if (error) throw error;
        toast.success('Draft saved');
      } else {
        const { data: newPost, error } = await supabase.from('blogs').insert([postData]).select().single();
        if (error) throw error;
        if (newPost) {
          setBlogId(newPost.id);
          navigate(`/admin/blog-editor?id=${newPost.id}`, { replace: true });
          toast.success('Draft saved');
        }
      }
      setValue('status', 'draft');
      setInitialFormData(watch());
      setInitialBody(body);
    } catch (error: any) {
      console.error('Error saving draft:', error);
      if (error.code === '23505') toast.error('Slug already exists');
      else toast.error('Failed to save draft');
    }
  };

  const publishPost = async () => {
    const data = watch();
    try {
      const postData = {
        title: data.title,
        subtitle: data.subtitle || null,
        author: data.author,
        slug: data.slug,
        excerpt: data.excerpt,
        category: data.category || null,
        tags: data.tags || null,
        banner_image: data.banner_image || null,
        body,
        status: 'published',
        date_published: new Date().toISOString(),
      };

      if (blogId) {
        const { error } = await supabase.from('blogs').update(postData).eq('id', blogId);
        if (error) throw error;
        toast.success('Post published!');
      } else {
        const { data: newPost, error } = await supabase.from('blogs').insert([postData]).select().single();
        if (error) throw error;
        if (newPost) {
          setBlogId(newPost.id);
          navigate(`/admin/blog-editor?id=${newPost.id}`, { replace: true });
          toast.success('Post published!');
        }
      }
      setValue('status', 'published');
      setInitialFormData(watch());
      setInitialBody(body);
    } catch (error: any) {
      console.error('Error publishing:', error);
      if (error.code === '23505') toast.error('Slug already exists');
      else toast.error('Failed to publish');
    }
  };

  const unpublishPost = async () => {
    if (!blogId) return;
    const data = watch();
    try {
      const postData = {
        title: data.title,
        subtitle: data.subtitle || null,
        author: data.author,
        slug: data.slug,
        excerpt: data.excerpt,
        category: data.category || null,
        tags: data.tags || null,
        banner_image: data.banner_image || null,
        body,
        status: 'draft',
        date_published: data.date_published,
      };
      const { error } = await supabase.from('blogs').update(postData).eq('id', blogId);
      if (error) throw error;
      toast.success('Post unpublished');
      setValue('status', 'draft');
      setInitialFormData(watch());
      setInitialBody(body);
    } catch (error: any) {
      console.error('Error unpublishing:', error);
      toast.error('Failed to unpublish');
    }
  };

  const archivePost = async () => {
    if (!blogId) return;
    const data = watch();
    try {
      const postData = {
        title: data.title,
        subtitle: data.subtitle || null,
        author: data.author,
        slug: data.slug,
        excerpt: data.excerpt,
        category: data.category || null,
        tags: data.tags || null,
        banner_image: data.banner_image || null,
        body,
        status: 'archived',
        date_published: data.date_published,
      };
      const { error } = await supabase.from('blogs').update(postData).eq('id', blogId);
      if (error) throw error;
      toast.success('Post archived');
      setValue('status', 'archived');
      setArchiveDialogOpen(false);
      setInitialFormData(watch());
      setInitialBody(body);
    } catch (error: any) {
      console.error('Error archiving:', error);
      toast.error('Failed to archive');
    }
  };

  const restorePost = async () => {
    if (!blogId) return;
    const data = watch();
    try {
      const postData = {
        title: data.title,
        subtitle: data.subtitle || null,
        author: data.author,
        slug: data.slug,
        excerpt: data.excerpt,
        category: data.category || null,
        tags: data.tags || null,
        banner_image: data.banner_image || null,
        body,
        status: 'published',
        date_published: new Date().toISOString(),
      };
      const { error } = await supabase.from('blogs').update(postData).eq('id', blogId);
      if (error) throw error;
      toast.success('Post restored to Published');
      setValue('status', 'published');
      setInitialFormData(watch());
      setInitialBody(body);
    } catch (error: any) {
      console.error('Error restoring:', error);
      toast.error('Failed to restore');
    }
  };

  const handleImageInsert = (url: string, alt: string) => {
    const markdown = `![${alt}](${url})`;
    setBody((prev) => prev + '\n\n' + markdown + '\n\n');
    setValue('body', body + '\n\n' + markdown + '\n\n');
  };

  const handleBannerInsert = (url: string) => {
    setValue('banner_image', url);
    toast.success('Banner image set!', {
      style: {
        background: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid hsl(var(--color-cyan))',
        color: 'hsl(var(--color-cyan))',
      },
    });
  };

  const handleBodyInsertFromHelper = (url: string, alt: string) => {
    const markdown = `![${alt}](${url})`;
    setBody((prev) => prev + '\n\n' + markdown + '\n\n');
    toast.success('Image inserted into body!', {
      style: {
        background: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid hsl(var(--color-cyan))',
        color: 'hsl(var(--color-cyan))',
      },
    });
  };

  const handleBannerAssetSelect = (url: string, filename: string) => {
    setValue('banner_image', url);
    toast.success('Banner image selected from library', {
      style: {
        background: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid hsl(var(--color-cyan))',
        color: 'hsl(var(--color-cyan))',
      },
    });
  };

  // Auto-save removed - explicit save actions only

  // Store the text API for emoji insertion
  const [textApi, setTextApi] = useState<any>(null);

  // Emoji command
  const emojiCommand: ICommand = {
    name: 'emoji',
    keyCommand: 'emoji',
    buttonProps: { 'aria-label': 'Insert emoji', title: 'Insert emoji' },
    icon: <Smile size={14} />,
    execute: () => {
      setShowEmojiPicker(!showEmojiPicker);
    },
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (textApi) {
      textApi.replaceSelection(emojiData.emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleBackClick = () => {
    if (isDirty) {
      setShowNavigateAwayDialog(true);
    } else {
      navigate('/admin/blog-dashboard');
    }
  };

  const handleClearForm = () => {
    reset(); 
    setBody(''); 
    setBlogId(null);
    setInitialFormData(null);
    setInitialBody('');
    navigate('/admin/blog-editor');
  };

  const previewData = useMemo(
    () => ({
      title: formData.title || 'Untitled Post',
      subtitle: formData.subtitle,
      author: formData.author || 'Aimee Farabee',
      excerpt: formData.excerpt || '',
      banner_image: formData.banner_image,
      body,
      date_published: new Date(formData.date_published),
    }),
    [formData, body]
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
            onClick={handleBackClick}
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
                    {blogId ? 'Edit Post' : 'New Post'}
                  </h2>

                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        {...register('title')}
                        className="mt-2"
                        style={{
                          background: 'rgba(26, 11, 46, 0.6)',
                          borderColor: errors.title ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                        }}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        {...register('subtitle')}
                        className="mt-2"
                        style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          {...register('author')}
                          className="mt-2"
                          style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                          id="slug"
                          {...register('slug')}
                          className="mt-2"
                          style={{
                            background: 'rgba(26, 11, 46, 0.6)',
                            borderColor: errors.slug ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                          }}
                        />
                        {errors.slug && (
                          <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                            {errors.slug.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        {...register('excerpt')}
                        rows={3}
                        className="mt-2"
                        style={{
                          background: 'rgba(26, 11, 46, 0.6)',
                          borderColor: errors.excerpt ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                        }}
                      />
                      {errors.excerpt && (
                        <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                          {errors.excerpt.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          {...register('category')}
                          className="mt-2"
                          style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          {...register('tags')}
                          placeholder="ai, coding, tutorial"
                          className="mt-2"
                          style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                        />
                      </div>
                    </div>

                    {/* Image Upload Helper */}
                    <ImageUploadHelper
                      onBannerInsert={handleBannerInsert}
                      onBodyInsert={handleBodyInsertFromHelper}
                    />

                    <div>
                      <Label htmlFor="banner_image">Banner Image URL</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="banner_image"
                          {...register('banner_image')}
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          className="flex-1"
                          style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAssetPickerOpen(true)}
                        >
                          Choose from Library
                        </Button>
                      </div>
                      {formData.banner_image && (
                        <img
                          src={formData.banner_image}
                          alt="Banner preview"
                          className="mt-2 w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Content *</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setImageModalOpen(true)}
                        >
                          <Image size={16} className="mr-2" />
                          Insert Image
                        </Button>
                      </div>
                      <div data-color-mode="dark" className="relative">
                        <MDEditor
                          value={body}
                          onChange={(val) => {
                            setBody(val || '');
                            setValue('body', val || '');
                          }}
                          height={600}
                          preview="edit"
                          visibleDragbar={false}
                          textareaProps={{
                            onFocus: (e) => {
                              const textarea = e.target;
                              setTextApi({
                                replaceSelection: (text: string) => {
                                  const start = textarea.selectionStart;
                                  const end = textarea.selectionEnd;
                                  const newValue = body.substring(0, start) + text + body.substring(end);
                                  setBody(newValue);
                                  setValue('body', newValue);
                                  setTimeout(() => {
                                    textarea.focus();
                                    textarea.setSelectionRange(start + text.length, start + text.length);
                                  }, 0);
                                }
                              });
                            }
                          }}
                          commands={[
                            commands.group(
                              [
                                commands.title1,
                                commands.title2,
                                commands.title3,
                                commands.title4,
                                commands.title5,
                                commands.title6,
                              ],
                              {
                                name: 'headings',
                                groupName: 'headings',
                                buttonProps: { 'aria-label': 'Insert headings', title: 'Insert heading (H1-H6)' },
                                icon: <span style={{ fontWeight: 'bold' }}>H</span>,
                              }
                            ),
                            commands.divider,
                            commands.group(
                              [fontSizeSmall, fontSizeNormal, fontSizeLarge, fontSizeExtraLarge],
                              {
                                name: 'fontSizes',
                                groupName: 'fontSizes',
                                buttonProps: { 'aria-label': 'Font sizes', title: 'Font size' },
                                icon: <span style={{ fontWeight: 'bold' }}>A</span>,
                              }
                            ),
                            commands.divider,
                            commands.group(
                              [colorBlack, colorCyan, colorPink, colorGray, colorRed, colorGreen, colorYellow, colorBlue],
                              {
                                name: 'textColors',
                                groupName: 'textColors',
                                buttonProps: { 'aria-label': 'Text color', title: 'Text color' },
                                icon: <Palette size={14} />,
                              }
                            ),
                            commands.divider,
                            commands.group(
                              [alignLeft, alignCenter, alignRight, alignJustify],
                              {
                                name: 'textAlign',
                                groupName: 'textAlign',
                                buttonProps: { 'aria-label': 'Text alignment', title: 'Text alignment' },
                                icon: <AlignLeft size={14} />,
                              }
                            ),
                            commands.divider,
                            emojiCommand,
                            commands.divider,
                            {
                              ...commands.bold,
                              buttonProps: { ...commands.bold.buttonProps, title: 'Bold text (Ctrl+B)' }
                            },
                            {
                              ...commands.italic,
                              buttonProps: { ...commands.italic.buttonProps, title: 'Italic text (Ctrl+I)' }
                            },
                            {
                              ...underline,
                              buttonProps: { ...underline.buttonProps, title: 'Underline text' }
                            },
                            {
                              ...commands.strikethrough,
                              buttonProps: { ...commands.strikethrough.buttonProps, title: 'Strikethrough text' }
                            },
                            commands.divider,
                            {
                              ...commands.link,
                              buttonProps: { ...commands.link.buttonProps, title: 'Insert link (Ctrl+K)' }
                            },
                            {
                              ...commands.quote,
                              buttonProps: { ...commands.quote.buttonProps, title: 'Insert quote' }
                            },
                            {
                              ...commands.code,
                              buttonProps: { ...commands.code.buttonProps, title: 'Insert code' }
                            },
                            commands.divider,
                            {
                              ...commands.unorderedListCommand,
                              buttonProps: { ...commands.unorderedListCommand.buttonProps, title: 'Bulleted list' }
                            },
                            {
                              ...commands.orderedListCommand,
                              buttonProps: { ...commands.orderedListCommand.buttonProps, title: 'Numbered list' }
                            },
                            {
                              ...commands.checkedListCommand,
                              buttonProps: { ...commands.checkedListCommand.buttonProps, title: 'Checklist' }
                            },
                            commands.divider,
                            {
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
                            },
                            commands.divider,
                          ]}
                          extraCommands={[
                            {
                              ...commands.codeEdit,
                              buttonProps: { ...commands.codeEdit.buttonProps, title: 'Edit mode' }
                            },
                            {
                              ...commands.codeLive,
                              buttonProps: { ...commands.codeLive.buttonProps, title: 'Live preview' }
                            },
                            {
                              ...commands.codePreview,
                              buttonProps: { ...commands.codePreview.buttonProps, title: 'Preview mode' }
                            },
                            commands.divider,
                            {
                              ...commands.fullscreen,
                              buttonProps: { ...commands.fullscreen.buttonProps, title: 'Toggle fullscreen' }
                            },
                          ]}
                        />
                        {showEmojiPicker && (
                          <div className="absolute z-50 mt-2">
                            <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
                          </div>
                        )}
                      </div>
                      {errors.body && (
                        <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                          {errors.body.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-foreground/70">Status</Label>
                        <div className="mt-2 flex items-center gap-3">
                          {formData.status === 'draft' && <Badge variant="outline" className="bg-muted text-muted-foreground">Draft - Not visible to public</Badge>}
                          {formData.status === 'published' && <Badge className="bg-primary/20 text-primary border-primary">Published - Live and visible</Badge>}
                          {formData.status === 'archived' && <Badge className="bg-amber-500/20 text-amber-500 border-amber-500">Archived - Hidden but preserved</Badge>}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="date_published">Publish Date</Label>
                        <Input
                          id="date_published"
                          type="date"
                          {...register('date_published')}
                          className="mt-2"
                          style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'hsl(var(--color-cyan) / 0.2)' }}>
                      <Button type="button" onClick={saveDraft}><Save size={16} className="mr-2" />Save Draft</Button>
                      {formData.status === 'archived' ? (
                        <Button type="button" onClick={restorePost}><RotateCcw size={16} className="mr-2" />Restore to Published</Button>
                      ) : formData.status === 'published' ? (
                        <Button type="button" variant="outline" onClick={unpublishPost}>Unpublish</Button>
                      ) : (
                        <Button type="button" onClick={publishPost} className="bg-primary/90 hover:bg-primary">Publish Now</Button>
                      )}
                      <div className="flex-1"></div>
                      {blogId && <Button type="button" variant="outline" onClick={() => setArchiveDialogOpen(true)} className="text-amber-500 border-amber-500 hover:bg-amber-500/10">Archive</Button>}
                      <Button type="button" variant="ghost" onClick={handleClearForm}>Clear Form</Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Preview Panel */}
              {viewMode !== 'edit' && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(26, 11, 46, 0.4)',
                    border: '2px solid hsl(var(--color-cyan) / 0.3)',
                    boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.2)',
                  }}
                >
                  <BlogPreview {...previewData} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload Modal */}
        <ImageUploadModal
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          onInsert={handleImageInsert}
        />

        {/* Asset Picker for Banner */}
        <AssetPicker
          open={isAssetPickerOpen}
          onClose={() => setIsAssetPickerOpen(false)}
          onSelect={handleBannerAssetSelect}
        />

        {/* Archive Confirmation Dialog */}
        <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Post</AlertDialogTitle>
              <AlertDialogDescription>
                This will archive the post and hide it from public view. You can restore it later by changing its status back to Published.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={archivePost} className="bg-amber-500 hover:bg-amber-600">Archive</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showNavigateAwayDialog} onOpenChange={setShowNavigateAwayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? All unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/admin/blog-dashboard')} className="bg-destructive hover:bg-destructive/90">Leave Without Saving</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
