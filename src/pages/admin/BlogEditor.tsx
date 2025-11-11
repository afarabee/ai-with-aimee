import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, Image, Save, Trash2 } from 'lucide-react';
import BlogPreview from '@/components/admin/BlogPreview';
import ImageUploadModal from '@/components/admin/ImageUploadModal';
import ImageUploadHelper from '@/components/admin/ImageUploadHelper';
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
  status: z.enum(['draft', 'published']).default('draft'),
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

// Group the font size commands
const fontSizeGroup: ICommand = {
  name: 'fontSizes',
  keyCommand: 'fontSizes',
  buttonProps: { 'aria-label': 'Font sizes' },
  icon: <span style={{ fontWeight: 'bold' }}>A</span>,
  children: [fontSizeSmall, fontSizeNormal, fontSizeLarge, fontSizeExtraLarge],
};

export default function BlogEditor() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const blogIdFromUrl = searchParams.get('id');
  const navigate = useNavigate();
  const [blogId, setBlogId] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
        reset({
          title: data.title,
          subtitle: data.subtitle || '',
          author: data.author || 'Aimee Farabee',
          slug: data.slug,
          excerpt: data.excerpt,
          category: data.category || '',
          tags: data.tags || '',
          banner_image: data.banner_image || '',
          body: data.body,
          status: (data.status || 'draft') as 'draft' | 'published',
          date_published: new Date(data.date_published).toISOString().split('T')[0],
        });
        setBody(data.body);
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
        reset({
          title: data.title,
          subtitle: data.subtitle || '',
          author: data.author || 'Aimee Farabee',
          slug: data.slug,
          excerpt: data.excerpt,
          category: data.category || '',
          tags: data.tags || '',
          banner_image: data.banner_image || '',
          body: data.body,
          status: (data.status || 'draft') as 'draft' | 'published',
          date_published: new Date(data.date_published).toISOString().split('T')[0],
        });
        setBody(data.body);
      }
    } catch (error) {
      console.error('Error loading post by ID:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (data: BlogFormData) => {
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
        const { error } = await supabase
          .from('blogs')
          .update(postData)
          .eq('id', blogId);

        if (error) throw error;
      } else {
        const { data: newPost, error } = await supabase
          .from('blogs')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        if (newPost) {
          setBlogId(newPost.id);
          navigate(`/admin/blog-editor/${newPost.slug}`, { replace: true });
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
      if (error.code === '23505') {
        toast.error('Slug already exists');
      } else {
        toast.error('Failed to save draft');
      }
    }
  };

  const onSubmit = async (data: BlogFormData, status: 'draft' | 'published') => {
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
        status,
        date_published: new Date(data.date_published).toISOString(),
      };

      if (blogId) {
        const { error } = await supabase
          .from('blogs')
          .update(postData)
          .eq('id', blogId);

        if (error) throw error;
      } else {
        const { data: newPost, error } = await supabase
          .from('blogs')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        if (newPost) {
          setBlogId(newPost.id);
        }
      }

      toast.success(status === 'published' ? 'Post published!' : 'Draft saved', {
        style: {
          background: 'rgba(0, 255, 255, 0.1)',
          border: '1px solid hsl(var(--color-cyan))',
          color: 'hsl(var(--color-cyan))',
        },
      });

      if (status === 'published') {
        navigate(`/blog/${data.slug}`);
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      
      if (error.code === '23505') {
        toast.error('Slug already exists. Please use a different slug.');
      } else if (error.code === '42501') {
        toast.error('Permission denied. Please check database policies.');
        console.error('RLS Policy Error:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else if (error.message?.includes('row-level security')) {
        toast.error('Database security policy prevented save.');
        console.error('RLS Error Details:', error);
      } else {
        toast.error(`Failed to save post: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleDelete = async () => {
    if (!blogId) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      toast.success('Post deleted', {
        style: {
          background: 'rgba(249, 249, 64, 0.1)',
          border: '1px solid hsl(var(--color-yellow))',
          color: 'hsl(var(--color-yellow))',
        },
      });
      navigate('/admin/blog-editor');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
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

  // Auto-save every 30 seconds
  useAutosave(
    formData,
    (data) => saveDraft(data),
    30000
  );

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
            onClick={() => navigate('/admin/blog-dashboard')}
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
                      <Input
                        id="banner_image"
                        {...register('banner_image')}
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="mt-2"
                        style={{ background: 'rgba(26, 11, 46, 0.6)' }}
                      />
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
                      <div data-color-mode="dark">
                        <MDEditor
                          value={body}
                          onChange={(val) => {
                            setBody(val || '');
                            setValue('body', val || '');
                          }}
                          height={600}
                          preview="edit"
                          visibleDragbar={false}
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
                                buttonProps: { 'aria-label': 'Insert headings' },
                                icon: <span style={{ fontWeight: 'bold' }}>H</span>,
                              }
                            ),
                            commands.divider,
                            fontSizeGroup,
                            commands.divider,
                            commands.bold,
                            commands.italic,
                            commands.strikethrough,
                            commands.divider,
                            commands.link,
                            commands.quote,
                            commands.code,
                            commands.divider,
                            commands.unorderedListCommand,
                            commands.orderedListCommand,
                            commands.checkedListCommand,
                            commands.divider,
                          ]}
                          extraCommands={[
                            commands.codeEdit,
                            commands.codeLive,
                            commands.codePreview,
                            commands.divider,
                            commands.fullscreen,
                          ]}
                        />
                      </div>
                      {errors.body && (
                        <p className="mt-1 text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                          {errors.body.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
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
                    <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: 'hsl(var(--color-cyan) / 0.2)' }}>
                      <Button
                        type="button"
                        onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
                        className="flex-1"
                        style={{
                          background: 'rgba(0, 255, 255, 0.2)',
                          border: '2px solid hsl(var(--color-cyan))',
                          color: 'hsl(var(--color-cyan))',
                        }}
                      >
                        <Save size={16} className="mr-2" />
                        {blogId ? 'Update Draft' : 'Save Draft'}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit((data) => onSubmit(data, 'published'))}
                        className="flex-1"
                        style={{
                          background: 'rgba(245, 12, 160, 0.2)',
                          border: '2px solid hsl(var(--color-pink))',
                          color: 'hsl(var(--color-pink))',
                        }}
                      >
                        {blogId ? 'Update & Publish' : 'Publish'}
                      </Button>
                      {blogId && (
                        <Button
                          type="button"
                          onClick={() => setDeleteDialogOpen(true)}
                          variant="outline"
                          style={{
                            borderColor: 'hsl(var(--color-yellow))',
                            color: 'hsl(var(--color-yellow))',
                          }}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={() => {
                          reset();
                          setBody('');
                          setBlogId(null);
                          navigate('/admin/blog-editor');
                        }}
                        variant="ghost"
                      >
                        Clear
                      </Button>
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
