import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Prompt {
  id: string;
  title: string;
  role: string | null;
  category: string | null;
  tags: string[];
  body: string;
  date_created: string;
  last_modified: string;
  status: string;
}

export default function PromptLibraryDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletePrompt, setDeletePrompt] = useState<{ id: string; title: string } | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<Prompt | null>(null);

  // Fetch all prompts
  const { data: prompts, isLoading, refetch } = useQuery({
    queryKey: ['admin-prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('last_modified', { ascending: false });
      if (error) throw error;
      return data as Prompt[];
    },
  });

  // Fetch distinct roles for filter dropdown
  const { data: roles } = useQuery({
    queryKey: ['prompt-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('role')
        .not('role', 'is', null);
      if (error) throw error;
      const uniqueRoles = [...new Set(data.map(p => p.role).filter(Boolean))].sort();
      return uniqueRoles as string[];
    },
  });

  // Fetch distinct categories for filter dropdown
  const { data: categories } = useQuery({
    queryKey: ['prompt-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('category')
        .not('category', 'is', null);
      if (error) throw error;
      const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))].sort();
      return uniqueCategories as string[];
    },
  });

  // Filter prompts based on search and filters
  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    
    return prompts.filter(prompt => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.body.toLowerCase().includes(searchLower) ||
        prompt.tags.some(t => t.toLowerCase().includes(searchLower));
      
      const matchesRole = roleFilter === 'all' || prompt.role === roleFilter;
      const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || prompt.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesCategory && matchesStatus;
    });
  }, [prompts, searchTerm, roleFilter, categoryFilter, statusFilter]);

  // Handle delete
  const handleDelete = async () => {
    if (!deletePrompt) return;
    
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', deletePrompt.id);
      
      if (error) throw error;
      
      toast.success(`Deleted: ${deletePrompt.title}`, {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      
      setDeletePrompt(null);
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete prompt');
    }
  };

  // Handle copy to clipboard
  const handleCopyPrompt = (body: string, title: string) => {
    navigator.clipboard.writeText(body);
    toast.success(`Copied: ${title}`, {
      style: {
        background: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid hsl(var(--color-cyan))',
        color: 'hsl(var(--color-cyan))',
      },
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-rajdhani bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              💬 Prompt Library Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Curate and manage reusable AI prompts for regulated markets.
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/prompt-editor')}
            className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-card/65 border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="text-cyan-300 font-rajdhani">Search Prompts</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, body, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-cyan-400/30 focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <Label htmlFor="role-filter" className="text-cyan-300 font-rajdhani">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="role-filter" className="border-cyan-400/30 focus:border-cyan-400">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles?.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category-filter" className="text-cyan-300 font-rajdhani">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="border-cyan-400/30 focus:border-cyan-400">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status-filter" className="text-cyan-300 font-rajdhani">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="border-cyan-400/30 focus:border-cyan-400">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-yellow-300">
            Showing {filteredPrompts.length} of {prompts?.length || 0} prompts
          </div>
        </Card>

        {/* Table (Desktop) */}
        <Card className="hidden md:block bg-card/65 border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          <Table>
            <TableHeader>
              <TableRow className="border-cyan-400/30 hover:bg-transparent">
                <TableHead className="text-cyan-300 font-rajdhani">Title</TableHead>
                <TableHead className="text-cyan-300 font-rajdhani">Role</TableHead>
                <TableHead className="text-cyan-300 font-rajdhani">Category</TableHead>
                <TableHead className="text-cyan-300 font-rajdhani">Tags</TableHead>
                <TableHead className="text-cyan-300 font-rajdhani">Status</TableHead>
                <TableHead className="text-cyan-300 font-rajdhani">Modified</TableHead>
                <TableHead className="text-cyan-300 font-rajdhani text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Loading prompts...
                  </TableCell>
                </TableRow>
              ) : filteredPrompts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No prompts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrompts.map(prompt => (
                  <TableRow key={prompt.id} className="border-cyan-400/30 hover:bg-cyan-400/5 prompt-card">
                    <TableCell 
                      className="font-medium text-pink-400 cursor-pointer hover:text-pink-300"
                      onClick={() => navigate(`/admin/prompt-editor?id=${prompt.id}`)}
                    >
                      {prompt.title}
                    </TableCell>
                    <TableCell className="text-cyan-300 text-sm uppercase">{prompt.role || '—'}</TableCell>
                    <TableCell className="text-yellow-300 text-sm">{prompt.category || '—'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                        {prompt.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{prompt.tags.length - 3} more</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          prompt.status === 'Published'
                            ? 'bg-yellow-400/15 text-yellow-400 border-2 border-yellow-400 shadow-[0_0_10px_rgba(249,249,64,0.5)]'
                            : 'bg-cyan-400/15 text-cyan-400 border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]'
                        }
                      >
                        {prompt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(prompt.last_modified), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/prompt-editor?id=${prompt.id}`)}
                          className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewPrompt(prompt)}
                          className="border-yellow-400 text-yellow-300 hover:bg-yellow-400/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletePrompt({ id: prompt.id, title: prompt.title })}
                          className="border-pink-400 text-pink-400 hover:bg-pink-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Cards (Mobile) */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            <Card className="p-6 bg-card/65 border-2 border-cyan-400/30 text-center text-muted-foreground">
              Loading prompts...
            </Card>
          ) : filteredPrompts.length === 0 ? (
            <Card className="p-6 bg-card/65 border-2 border-cyan-400/30 text-center text-muted-foreground">
              No prompts found
            </Card>
          ) : (
            filteredPrompts.map(prompt => (
              <Card key={prompt.id} className="p-4 bg-card/65 border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)] prompt-card">
                <h3 
                  className="text-lg font-bold text-pink-400 cursor-pointer hover:text-pink-300 mb-2"
                  onClick={() => navigate(`/admin/prompt-editor?id=${prompt.id}`)}
                >
                  {prompt.title}
                </h3>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-cyan-300 uppercase">{prompt.role || '—'}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-yellow-300">{prompt.category || '—'}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {prompt.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{prompt.tags.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge 
                    className={
                      prompt.status === 'Published'
                        ? 'bg-yellow-400/15 text-yellow-400 border-2 border-yellow-400'
                        : 'bg-cyan-400/15 text-cyan-400 border-2 border-cyan-400'
                    }
                  >
                    {prompt.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(prompt.last_modified), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/prompt-editor?id=${prompt.id}`)}
                    className="flex-1 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewPrompt(prompt)}
                    className="flex-1 border-yellow-400 text-yellow-300 hover:bg-yellow-400/10"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeletePrompt({ id: prompt.id, title: prompt.title })}
                    className="border-pink-400 text-pink-400 hover:bg-pink-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Preview Modal */}
        <AlertDialog open={!!previewPrompt} onOpenChange={() => setPreviewPrompt(null)}>
          <AlertDialogContent className="max-w-3xl bg-background/95 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-rajdhani text-cyan-400">
                {previewPrompt?.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="tag-pill">{previewPrompt?.role || 'No Role'}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-yellow-300">{previewPrompt?.category || 'No Category'}</span>
                </div>
                <pre className="prompt-preview text-cyan-300">
                  {previewPrompt?.body}
                </pre>
                <Button
                  onClick={() => previewPrompt && handleCopyPrompt(previewPrompt.body, previewPrompt.title)}
                  className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                >
                  Copy Prompt
                </Button>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={!!deletePrompt} onOpenChange={() => setDeletePrompt(null)}>
          <AlertDialogContent className="bg-background/95 border-2 border-pink-400/50 shadow-[0_0_30px_rgba(245,12,160,0.3)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-pink-400 font-rajdhani">Delete Prompt?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete <strong className="text-pink-400">{deletePrompt?.title}</strong>? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-pink-400/20 border-2 border-pink-400 text-pink-400 hover:bg-pink-400/30 hover:shadow-[0_0_15px_rgba(245,12,160,0.5)]"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
