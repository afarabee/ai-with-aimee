import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MailOpen, Edit3, Trash2, Plus, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';

interface NewsletterLog {
  id: string;
  title: string;
  subject: string;
  status: 'draft' | 'queued' | 'sent' | 'failed';
  send_type: 'adhoc' | 'scheduled';
  scheduled_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function NewsletterLogs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sendTypeFilter, setSendTypeFilter] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newsletterToDelete, setNewsletterToDelete] = useState<{ id: string; title: string } | null>(null);

  // Fetch newsletters
  const { data: newsletters, isLoading, refetch } = useQuery({
    queryKey: ['newsletter-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_queue')
        .select('id, title, subject, status, send_type, scheduled_date, created_at, updated_at')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as NewsletterLog[];
    },
  });

  // Filter newsletters
  const filteredNewsletters = useMemo(() => {
    if (!newsletters) return [];
    
    return newsletters.filter(newsletter => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        newsletter.title.toLowerCase().includes(searchLower) ||
        newsletter.subject.toLowerCase().includes(searchLower);
      
      const matchesStatus = 
        statusFilter === 'all' || 
        newsletter.status === statusFilter;
      
      const matchesSendType = 
        sendTypeFilter === 'all' || 
        newsletter.send_type === sendTypeFilter;
      
      return matchesSearch && matchesStatus && matchesSendType;
    });
  }, [newsletters, searchTerm, statusFilter, sendTypeFilter]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('newsletter_queue')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Newsletter deleted', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      queryClient.invalidateQueries({ queryKey: ['newsletter-logs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-newsletter-stats'] });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete newsletter');
    },
  });

  const handleEdit = (id: string) => {
    navigate(`/admin/newsletter-composer?id=${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    setNewsletterToDelete({ id, title });
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (newsletterToDelete) {
      deleteMutation.mutate(newsletterToDelete.id);
    }
    setShowDeleteDialog(false);
    setNewsletterToDelete(null);
  };

  const handleNewNewsletter = () => {
    navigate('/admin/newsletter-dashboard');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: 'status-badge-draft',
      queued: 'status-badge-queued',
      sent: 'status-badge-sent',
      failed: 'status-badge-failed',
    };
    return statusMap[status as keyof typeof statusMap] || 'status-badge-draft';
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-rajdhani font-bold mb-2 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              📬 Newsletter Logs
            </h1>
            <p className="text-muted-foreground font-ibm-plex">
              All saved and queued issues for AI with Aimee.
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-pink-400 to-cyan-400 mt-4 rounded-full" />
          </div>
          <Button
            onClick={handleNewNewsletter}
            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Newsletter
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-background/40 backdrop-blur border-cyan-500/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="text-cyan-400 font-rajdhani">Search</Label>
              <Input
                id="search"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 bg-background/60 border-cyan-500/30 focus:border-pink-500"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-cyan-400 font-rajdhani">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="mt-1 bg-background/60 border-cyan-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sendType" className="text-cyan-400 font-rajdhani">Send Type</Label>
              <Select value={sendTypeFilter} onValueChange={setSendTypeFilter}>
                <SelectTrigger id="sendType" className="mt-1 bg-background/60 border-cyan-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="adhoc">Adhoc</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground font-ibm-plex">
            Showing {filteredNewsletters.length} of {newsletters?.length || 0} newsletters
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!newsletters || newsletters.length === 0) && (
          <Card className="p-12 text-center bg-background/40 backdrop-blur border-cyan-500/30">
            <Mail className="h-24 w-24 mx-auto mb-4 text-cyan-400 opacity-50" />
            <h3 className="text-2xl font-rajdhani font-bold text-pink-400 mb-2">
              No newsletters yet
            </h3>
            <p className="text-muted-foreground font-ibm-plex mb-6">
              Start creating your first issue!
            </p>
            <Button
              onClick={handleNewNewsletter}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Newsletter
            </Button>
          </Card>
        )}

        {/* Desktop Table View */}
        {!isLoading && filteredNewsletters.length > 0 && (
          <>
            <div className="hidden md:block">
              <Card className="overflow-hidden bg-background/40 backdrop-blur border-cyan-500/30">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cyan-500/30 hover:bg-transparent">
                      <TableHead className="text-cyan-400 font-rajdhani font-semibold uppercase">Title</TableHead>
                      <TableHead className="text-cyan-400 font-rajdhani font-semibold uppercase">Subject</TableHead>
                      <TableHead className="text-cyan-400 font-rajdhani font-semibold uppercase">Status</TableHead>
                      <TableHead className="text-cyan-400 font-rajdhani font-semibold uppercase">Send Type</TableHead>
                      <TableHead className="text-cyan-400 font-rajdhani font-semibold uppercase">Scheduled</TableHead>
                      <TableHead className="text-cyan-400 font-rajdhani font-semibold uppercase">Updated</TableHead>
                      <TableHead className="text-cyan-400 font-rajdhani font-semibold uppercase text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNewsletters.map((newsletter) => (
                      <TableRow 
                        key={newsletter.id} 
                        className="newsletter-logs-row border-cyan-500/20"
                      >
                        <TableCell 
                          className="font-semibold text-pink-400 cursor-pointer hover:text-pink-300"
                          onClick={() => handleEdit(newsletter.id)}
                        >
                          {newsletter.title}
                        </TableCell>
                        <TableCell className="text-cyan-400 font-ibm-plex">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {truncateText(newsletter.subject, 40)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{newsletter.subject}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(newsletter.status)} font-rajdhani font-bold uppercase text-xs`}>
                            {newsletter.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-ibm-plex uppercase text-xs">
                          {newsletter.send_type}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-ibm-plex text-sm">
                          {newsletter.scheduled_date 
                            ? format(new Date(newsletter.scheduled_date), 'MMM dd, yyyy HH:mm')
                            : '—'
                          }
                        </TableCell>
                        <TableCell className="text-muted-foreground font-ibm-plex text-sm">
                          {format(new Date(newsletter.updated_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(newsletter.id)}
                            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(newsletter.id, newsletter.title)}
                            className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredNewsletters.map((newsletter) => (
                <Card 
                  key={newsletter.id} 
                  className="newsletter-logs-card p-4 space-y-3"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleEdit(newsletter.id)}
                  >
                    <h3 className="font-rajdhani font-bold text-lg text-pink-400 mb-1">
                      {newsletter.title}
                    </h3>
                    <p className="text-sm text-cyan-400 font-ibm-plex">
                      {truncateText(newsletter.subject, 60)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${getStatusBadge(newsletter.status)} font-rajdhani font-bold uppercase text-xs`}>
                      {newsletter.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground uppercase">
                      {newsletter.send_type}
                    </span>
                  </div>
                  {newsletter.scheduled_date && (
                    <div className="text-xs text-muted-foreground">
                      <strong className="text-yellow-400">Scheduled:</strong> {format(new Date(newsletter.scheduled_date), 'MMM dd, yyyy HH:mm')}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-cyan-400">Updated:</strong> {format(new Date(newsletter.updated_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-cyan-500/20">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(newsletter.id)}
                      className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(newsletter.id, newsletter.title)}
                      className="flex-1 border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-background/95 backdrop-blur border-pink-500/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-pink-400 font-rajdhani text-2xl">
                Delete Newsletter?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-ibm-plex">
                Are you sure you want to delete <strong className="text-cyan-400">"{newsletterToDelete?.title}"</strong>?
                <br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
