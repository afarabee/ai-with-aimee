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

interface Project {
  id: string;
  project_title: string;
  subtitle: string;
  body: string;
  date_published: string;
  technologies: string[];
  github_link: string | null;
  project_page_link: string | null;
  thumbnail: string | null;
  status: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function ProjectDashboard() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'archived'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    return projects.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        project.project_title.toLowerCase().includes(searchLower) ||
        project.subtitle.toLowerCase().includes(searchLower) ||
        project.technologies.some(t => t.toLowerCase().includes(searchLower));
      
      const matchesStatus = 
        statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteTarget.id);
      
      if (error) throw error;
      
      toast.success('Project deleted successfully', {
        style: {
          background: 'rgba(245, 12, 160, 0.1)',
          border: '1px solid hsl(var(--color-pink))',
          color: 'hsl(var(--color-pink))',
        },
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting project:', error);
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
    const colorMap: Record<string, string> = {
      draft: '#00ffff',
      active: '#f9f940',
      completed: '#f50ca0',
      archived: '#888888',
    };
    
    const color = colorMap[status.toLowerCase()] || '#00ffff';
    
    return (
      <Badge
        className="font-rajdhani uppercase tracking-wide"
        style={{
          background: `${color}15`,
          border: `2px solid ${color}`,
          color,
          textShadow: `0 0 8px ${color}99`,
        }}
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  const TechnologyPills = ({ technologies }: { technologies: string[] }) => {
    const displayTechs = technologies.slice(0, 3);
    const remaining = technologies.length - 3;
    
    return (
      <div className="flex gap-2 flex-wrap">
        {displayTechs.map((tech, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs font-rajdhani rounded"
            style={{
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid #00ffff',
              color: '#00ffff',
            }}
          >
            {tech}
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
            +{remaining} more
          </span>
        )}
      </div>
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
            🚀 Project Management Dashboard
          </h1>
          <Button
            onClick={() => navigate('/admin/project-editor')}
            className="font-montserrat font-bold transition-all"
            style={{
              background: 'rgba(0, 255, 255, 0.2)',
              border: '2px solid hsl(var(--color-cyan))',
              color: 'hsl(var(--color-cyan))',
              boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.4)',
            }}
          >
            <Plus size={16} className="mr-2" />
            New Project
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
                Search by Title, Subtitle, or Technology
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
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <p 
            className="mt-4 text-sm font-rajdhani" 
            style={{ color: 'hsl(var(--color-cyan))' }}
          >
            Showing {filteredProjects?.length || 0} of {projects?.length || 0} projects
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="text-xl font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
              Loading projects...
            </p>
          </div>
        )}

        {!isLoading && filteredProjects?.length === 0 && (
          <div 
            className="text-center py-20 rounded-xl"
            style={{
              background: 'rgba(26, 11, 46, 0.6)',
              border: '2px solid hsl(var(--color-cyan) / 0.3)',
            }}
          >
            <p className="text-xl font-rajdhani mb-2" style={{ color: 'hsl(var(--color-cyan))' }}>
              No projects found
            </p>
            <p className="text-sm font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create your first project to get started'}
            </p>
          </div>
        )}

        {!isLoading && filteredProjects && filteredProjects.length > 0 && (
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
                      Updated
                    </th>
                    <th className="text-left p-4 font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                      Technologies
                    </th>
                    <th className="text-right p-4 font-rajdhani" style={{ color: 'hsl(var(--color-cyan))' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr 
                      key={project.id}
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
                          onClick={() => navigate(`/admin/project-editor?id=${project.id}`)}
                          className="text-left font-ibm-plex hover:underline transition-colors"
                          style={{ 
                            color: 'hsl(var(--color-pink))',
                          }}
                        >
                          {project.project_title}
                        </button>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="p-4 font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                        {format(new Date(project.updated_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-4">
                        <TechnologyPills technologies={project.technologies} />
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/project-editor?id=${project.id}`)}
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
                            onClick={() => {
                              if (project.project_page_link) {
                                window.open(project.project_page_link, '_blank');
                              } else {
                                toast.info('No project page link set');
                              }
                            }}
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
                              setDeleteTarget(project);
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

        {!isLoading && filteredProjects && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  border: '2px solid hsl(var(--color-cyan) / 0.3)',
                  boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.2)',
                }}
              >
                <button
                  onClick={() => navigate(`/admin/project-editor?id=${project.id}`)}
                  className="text-left font-ibm-plex font-bold text-lg mb-2 hover:underline block w-full"
                  style={{ color: 'hsl(var(--color-pink))' }}
                >
                  {project.project_title}
                </button>
                
                <div className="mb-3">
                  <StatusBadge status={project.status} />
                </div>
                
                <div className="mb-3">
                  <TechnologyPills technologies={project.technologies} />
                </div>
                
                <div className="flex gap-2 mb-3 text-sm font-ibm-plex" style={{ color: 'hsl(var(--color-light-text))' }}>
                  <span>{format(new Date(project.updated_at), 'MMM dd, yyyy')}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/admin/project-editor?id=${project.id}`)}
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
                    onClick={() => {
                      if (project.project_page_link) {
                        window.open(project.project_page_link, '_blank');
                      } else {
                        toast.info('No project page link set');
                      }
                    }}
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
                      setDeleteTarget(project);
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
            boxShadow: '0 0 40px hsl(var(--color-pink) / 0.3)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle 
              className="font-rajdhani text-2xl"
              style={{ color: 'hsl(var(--color-pink))' }}
            >
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription 
              className="font-ibm-plex"
              style={{ color: 'hsl(var(--color-light-text))' }}
            >
              Are you sure you want to delete "{deleteTarget?.project_title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: 'rgba(0, 255, 255, 0.1)',
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
