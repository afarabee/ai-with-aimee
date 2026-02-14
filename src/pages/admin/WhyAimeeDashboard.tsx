import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface WhyAimeeEntry {
  id: string;
  company: string;
  role: string;
  slug: string;
  status: string;
  created_at: string;
}

export default function WhyAimeeDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [archiveTarget, setArchiveTarget] = useState<WhyAimeeEntry | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const { data: entries, isLoading, refetch } = useQuery({
    queryKey: ['why-aimee-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('why_aimee')
        .select('id, company, role, slug, status, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as WhyAimeeEntry[];
    },
  });

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    return entries.filter(entry => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = entry.company.toLowerCase().includes(searchLower) || entry.role.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [entries, searchTerm, statusFilter]);

  const handleArchive = async () => {
    if (!archiveTarget) return;
    try {
      const { error } = await supabase.from('why_aimee').update({ status: 'archived' }).eq('id', archiveTarget.id);
      if (error) throw error;
      toast.success('Entry archived');
      refetch();
    } catch (error: any) {
      toast.error(`Archive failed: ${error.message}`);
    } finally {
      setArchiveDialogOpen(false);
      setArchiveTarget(null);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variant = status === 'draft' ? 'outline' : status === 'archived' ? 'secondary' : 'default';
    return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-[1800px]">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-4xl font-bold text-primary">Why Aimee</h1>
          <Button onClick={() => navigate('/admin/why-aimee-editor')}>
            <Plus className="mr-2 h-4 w-4" />New Entry
          </Button>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Search by Company / Role</Label>
              <Input type="text" placeholder="Type to search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entries</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Showing {filteredEntries?.length || 0} of {entries?.length || 0} entries</p>
        </div>

        {isLoading && <div className="text-center py-20"><p className="text-xl">Loading entries...</p></div>}

        {!isLoading && filteredEntries?.length === 0 && (
          <div className="text-center py-20 rounded-xl bg-card border border-border">
            <p className="text-xl mb-2">No entries found</p>
            <p className="text-sm text-muted-foreground">{searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first Why Aimee entry'}</p>
          </div>
        )}

        {!isLoading && filteredEntries && filteredEntries.length > 0 && (
          <div className="rounded-xl overflow-hidden bg-card border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Company</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <button onClick={() => navigate(`/admin/why-aimee-editor?id=${entry.id}`)} className="text-left hover:underline text-primary font-medium">{entry.company}</button>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">{entry.role}</td>
                    <td className="p-4"><StatusBadge status={entry.status} /></td>
                    <td className="p-4 text-muted-foreground">{format(new Date(entry.created_at), 'MMM dd, yyyy')}</td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/why-aimee-editor?id=${entry.id}`)}><Edit className="h-4 w-4" /></Button>
                        {entry.status === 'published' && (
                          <Button size="sm" variant="outline" onClick={() => window.open(`/why-aimee/${entry.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                        )}
                        {entry.status !== 'archived' && (
                          <Button size="sm" variant="destructive" onClick={() => { setArchiveTarget(entry); setArchiveDialogOpen(true); }}><Archive className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Entry?</AlertDialogTitle>
            <AlertDialogDescription>This will archive the "{archiveTarget?.company}" entry. It will no longer be visible on the public page.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
