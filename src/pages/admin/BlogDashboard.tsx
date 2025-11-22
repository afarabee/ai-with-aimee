import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Blog {
  id: string;
  title: string;
  slug: string;
  status: string;
  date_published: string;
  category: string | null;
  subtitle: string | null;
  author: string | null;
  excerpt: string;
  body: string;
  tags: string | null;
  banner_image: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function BlogDashboard() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: blogs, isLoading, refetch } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .is('deleted_at', null)
        .order('date_published', { ascending: false });
      
      if (error) throw error;
      return data as Blog[];
    },
  });

  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    
    return blogs.filter(blog => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchLower) ||
        (blog.category?.toLowerCase() || '').includes(searchLower);
      
      const matchesStatus = 
        statusFilter === 'all' || blog.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', deleteTarget.id);
      
      if (error) throw error;
      
      toast.success('Blog deleted successfully', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      toast.error(`Failed to delete: ${error.message || 'Unknown error'}`, {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const isDraft = status === 'draft';
    return (
      <Badge
        className="font-rajdhani"
        style={{
          background: isDraft 
            ? 'rgba(0, 255, 255, 0.15)' 
            : 'rgba(249, 249, 64, 0.15)',
          border: `2px solid ${isDraft ? '#00ffff' : '#f9f940'}`,
          color: isDraft ? '#00ffff' : '#f9f940',
          textShadow: `0 0 8px ${isDraft ? 'rgba(0, 255, 255, 0.5)' : 'rgba(249, 249, 64, 0.5)'}`,
        }}
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-[1800px]">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 
              className="text-4xl font-rajdhani font-bold"
              style={{ color: 'hsl(var(--color-cyan))' }}
            >
              🧠 Blog Management Dashboard
            </h1>
            <Button
              onClick={() => navigate('/admin/blog-editor')}
              className="font-montserrat font-bold transition-all"
              style={{
                background: 'rgba(0, 255, 255, 0.2)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
                boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.4)',
              }}
            >
              <Plus size={16} className="mr-2" />
              New Blog Post
            </Button>
          </div>

          <div 
            className="p-6 rounded-xl backdrop-blur-md mb-8"
            style={{
              background: 'rgba(26, 11, 46, 0.6)',
              border: '2px solid hsl(var(--color-cyan) / 0.3)',
              boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.2)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label 
                  className="font-rajdhani mb-2 block"
                  style={{ color: 'hsl(var(--color-cyan))' }}
                >
                  Search by Title or Category
                </Label>
                <Input
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="font-ibm-plex"
                  style={{
                    background: 'rgba(26, 11, 46, 0.6)',
                    borderColor: 'hsl(var(--color-cyan) / 0.3)',
                    color: 'hsl(var(--color-light-text))',
                  }}
                />
              </div>
              
              <div>
                <Label 
                  className="font-rajdhani mb-2 block"
                  style={{ color: 'hsl(var(--color-cyan))' }}
                >
                  Filter by Status
                </Label>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger 
                    className="font-ibm-plex"
                    style={{ 
                      background: 'rgba(26, 11, 46, 0.6)',
                      borderColor: 'hsl(var(--color-cyan) / 0.3)',
                      color: 'hsl(var(--color-light-text))',
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="draft">Drafts Only</SelectItem>
                    <SelectItem value="published">Published Only</SelectItem>
                    <SelectItem value="archived">Archived Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <p 
              className="mt-4 text-sm font-rajdhani" 
              style={{ color: 'hsl(var(--color-cyan))' }}
            >
              Showing {filteredBlogs?.length || 0} of {blogs?.length || 0} posts
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-20">
              <p className="text-xl font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                Loading posts...
              </p>
            </div>
          )}

          {!isLoading && filteredBlogs?.length === 0 && (
            <div 
              className="text-center py-20 rounded-xl"
              style={{
                background: 'rgba(26, 11, 46, 0.6)',
                border: '2px solid hsl(var(--color-cyan) / 0.3)',
              }}
            >
              <p className="text-xl font-rajdhani mb-2" style={{ color: 'hsl(var(--color-cyan))' }}>
                No posts found
              </p>
              <p className="text-sm font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Create your first blog post to get started'}
              </p>
            </div>
          )}

          {!isLoading && filteredBlogs && filteredBlogs.length > 0 && (
            <div className="hidden md:block">
              <div 
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  border: '2px solid hsl(var(--color-cyan) / 0.3)',
                  boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.2)',
                }}
              >
                <table className="w-full">
                  <thead style={{ background: 'rgba(0, 255, 255, 0.1)' }}>
                    <tr>
                      <th className="text-left p-4 font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                        Title
                      </th>
                      <th className="text-left p-4 font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                        Status
                      </th>
                      <th className="text-left p-4 font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                        Date
                      </th>
                      <th className="text-left p-4 font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                        Category
                      </th>
                      <th className="text-right p-4 font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((blog) => (
                      <tr 
                        key={blog.id}
                        className="transition-all duration-300"
                        style={{
                          borderBottom: '1px solid hsl(var(--color-cyan) / 0.1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 255, 255, 0.05)';
                          e.currentTarget.style.boxShadow = '0 0 20px hsl(var(--color-cyan) / 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <td className="p-4">
                          <button
                            onClick={() => navigate(`/admin/blog-editor?id=${blog.id}`)}
                            className="text-left font-ibm-plex hover:underline transition-colors"
                            style={{ 
                              color: 'hsl(var(--color-pink))',
                            }}
                          >
                            {blog.title}
                          </button>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={blog.status} />
                        </td>
                        <td className="p-4 font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                          {format(new Date(blog.date_published), 'MMM dd, yyyy')}
                        </td>
                        <td className="p-4 font-ibm-plex" style={{ color: 'hsl(var(--color-cyan))' }}>
                          {blog.category || 'Uncategorized'}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              onClick={() => navigate(`/admin/blog-editor?id=${blog.id}`)}
                              style={{
                                background: 'rgba(0, 255, 255, 0.15)',
                                border: '2px solid #00ffff',
                                color: '#00ffff',
                              }}
                            >
                              <Edit size={16} />
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                              style={{
                                background: 'rgba(249, 249, 64, 0.15)',
                                border: '2px solid #f9f940',
                                color: '#f9f940',
                              }}
                            >
                              <Eye size={16} />
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => {
                                setDeleteTarget(blog);
                                setDeleteDialogOpen(true);
                              }}
                              style={{
                                background: 'rgba(245, 12, 160, 0.15)',
                                border: '2px solid hsl(var(--color-pink))',
                                color: 'hsl(var(--color-pink))',
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isLoading && filteredBlogs && filteredBlogs.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="p-4 rounded-xl transition-all duration-300"
                  style={{
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '2px solid hsl(var(--color-cyan) / 0.3)',
                    boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.2)',
                  }}
                >
                  <button
                    onClick={() => navigate(`/admin/blog-editor?id=${blog.id}`)}
                    className="text-left font-ibm-plex font-bold text-lg mb-2 hover:underline block w-full"
                    style={{ color: 'hsl(var(--color-pink))' }}
                  >
                    {blog.title}
                  </button>
                  
                  <div className="mb-3">
                    <StatusBadge status={blog.status} />
                  </div>
                  
                  <div className="flex gap-4 mb-3 text-sm font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                    <span>{format(new Date(blog.date_published), 'MMM dd, yyyy')}</span>
                    <span style={{ color: 'hsl(var(--color-cyan))' }}>
                      {blog.category || 'Uncategorized'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/admin/blog-editor?id=${blog.id}`)}
                      className="flex-1"
                      style={{
                        background: 'rgba(0, 255, 255, 0.15)',
                        border: '2px solid #00ffff',
                        color: '#00ffff',
                      }}
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                      className="flex-1"
                      style={{
                        background: 'rgba(249, 249, 64, 0.15)',
                        border: '2px solid #f9f940',
                        color: '#f9f940',
                      }}
                    >
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => {
                        setDeleteTarget(blog);
                        setDeleteDialogOpen(true);
                      }}
                      className="flex-1"
                      style={{
                        background: 'rgba(245, 12, 160, 0.15)',
                        border: '2px solid hsl(var(--color-pink))',
                        color: 'hsl(var(--color-pink))',
                      }}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          style={{
            background: 'rgba(26, 11, 46, 0.95)',
            border: '2px solid hsl(var(--color-pink) / 0.5)',
            boxShadow: '0 0 40px hsl(var(--color-pink) / 0.4)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle 
              className="font-rajdhani"
              style={{ color: 'hsl(var(--color-pink))' }}
            >
              Delete "{deleteTarget?.title}"?
            </AlertDialogTitle>
            <AlertDialogDescription 
              className="font-ibm-plex"
              style={{ color: 'hsl(var(--color-light-text))' }}
            >
              This will soft-delete the blog post. It won't be visible in the dashboard or public site, 
              but the data will remain in the database and can be recovered if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: 'rgba(0, 255, 255, 0.15)',
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
    </>
  );
}
