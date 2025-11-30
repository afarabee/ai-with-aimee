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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Blog {
  id: string;
  title: string;
  slug: string;
  status: string;
  date_published: string;
}

export default function BlogsHub() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: blogs, isLoading, refetch } = useQuery({
    queryKey: ['blogs-hub'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blogs').select('id, title, slug, status, date_published').is('deleted_at', null).order('date_published', { ascending: false });
      if (error) throw error;
      return data as Blog[];
    },
  });

  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter(blog => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = blog.title.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from('blogs').update({ deleted_at: new Date().toISOString() }).eq('id', deleteTarget.id);
      if (error) throw error;
      toast.success('Blog deleted');
      refetch();
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge variant={status === 'draft' ? 'outline' : 'default'}>{status.toUpperCase()}</Badge>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-[1800px]">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-4xl font-bold text-primary">Blogs</h1>
          <Button onClick={() => navigate('/admin/blogs/new')}><Plus className="mr-2 h-4 w-4" />New Blog Post</Button>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Search by Title</Label>
              <Input type="text" placeholder="Type to search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Showing {filteredBlogs?.length || 0} of {blogs?.length || 0} posts</p>
        </div>

        {isLoading && <div className="text-center py-20"><p className="text-xl">Loading posts...</p></div>}

        {!isLoading && filteredBlogs?.length === 0 && (
          <div className="text-center py-20 rounded-xl bg-card border border-border">
            <p className="text-xl mb-2">No posts found</p>
            <p className="text-sm text-muted-foreground">{searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first blog post'}</p>
          </div>
        )}

        {!isLoading && filteredBlogs && filteredBlogs.length > 0 && (
          <div className="rounded-xl overflow-hidden bg-card border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <button onClick={() => navigate(`/admin/blogs/edit?id=${blog.id}`)} className="text-left hover:underline text-primary font-medium">{blog.title}</button>
                    </td>
                    <td className="p-4"><StatusBadge status={blog.status} /></td>
                    <td className="p-4 text-muted-foreground">{format(new Date(blog.date_published), 'MMM dd, yyyy')}</td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/blogs/edit?id=${blog.id}`)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => { setDeleteTarget(blog); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
            <AlertDialogDescription>This will soft-delete "{deleteTarget?.title}". You can recover it from the database if needed.</AlertDialogDescription>
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
