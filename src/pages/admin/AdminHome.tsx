import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Rocket, Image, Mail, 
  PlusCircle, Upload, BookOpen, Dot,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  route: string;
  color: 'cyan' | 'pink' | 'yellow';
}

const MetricCard = ({ icon: Icon, title, value, subtitle, route, color }: MetricCardProps) => {
  const navigate = useNavigate();
  const colorMap = {
    cyan: 'hsl(var(--color-cyan))',
    pink: 'hsl(var(--color-pink))',
    yellow: 'hsl(var(--color-yellow))'
  };
  
  return (
    <Card
      onClick={() => navigate(route)}
      className="cursor-pointer transition-all duration-300 hover:scale-105 p-6"
      style={{
        background: 'rgba(26, 11, 46, 0.65)',
        border: `2px solid ${colorMap[color]}33`,
        boxShadow: `0 0 20px ${colorMap[color]}33`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${colorMap[color]}66`;
        e.currentTarget.style.transform = 'translateY(-4px) rotateX(2deg) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${colorMap[color]}33`;
        e.currentTarget.style.transform = 'translateY(0) rotateX(0) scale(1)';
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} style={{ color: colorMap[color] }} />
        <h3 
          className="text-3xl font-rajdhani font-bold"
          style={{ 
            color: colorMap[color],
            textShadow: `0 0 10px ${colorMap[color]}99`
          }}
        >
          {value}
        </h3>
      </div>
      <p className="text-sm font-ibm-plex mb-2 text-[#e0e0e0]">
        {title}
      </p>
      <p className="text-xs font-ibm-plex" style={{ color: colorMap[color] }}>
        {subtitle}
      </p>
    </Card>
  );
};

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  route: string;
  color: 'cyan' | 'pink' | 'yellow';
}

const QuickActionButton = ({ icon: Icon, label, route, color }: QuickActionButtonProps) => {
  const navigate = useNavigate();
  const colorMap = {
    cyan: 'hsl(var(--color-cyan))',
    pink: 'hsl(var(--color-pink))',
    yellow: 'hsl(var(--color-yellow))'
  };

  return (
    <Button
      onClick={() => navigate(route)}
      className="w-full p-6 text-lg font-rajdhani transition-all duration-300"
      style={{
        background: `${colorMap[color]}15`,
        border: `2px solid ${colorMap[color]}`,
        color: colorMap[color],
        boxShadow: `0 0 15px ${colorMap[color]}33`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${colorMap[color]}66`;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 15px ${colorMap[color]}33`;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Icon size={20} className="mr-2" />
      {label}
    </Button>
  );
};

export default function AdminHome() {
  const navigate = useNavigate();

  // Fetch blog stats
  const { data: blogStats } = useQuery({
    queryKey: ['admin-blog-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, status, updated_at')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return {
        total: data.length,
        drafts: data.filter(b => b.status === 'draft').length,
        published: data.filter(b => b.status === 'published').length,
        lastUpdated: data.length > 0 ? data[0].updated_at : null
      };
    }
  });

  // Fetch recent blogs for feed
  const { data: recentBlogs } = useQuery({
    queryKey: ['admin-recent-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, status, updated_at')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  // Fetch recent projects for feed
  const { data: recentProjects } = useQuery({
    queryKey: ['admin-recent-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_title, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  // Fetch project stats
  const { data: projectStats } = useQuery({
    queryKey: ['admin-project-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, status, updated_at')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      
      const total = data.length;
      const active = data.filter(p => p.status === 'Active').length;
      const draft = data.filter(p => p.status === 'Draft').length;
      const completed = data.filter(p => p.status === 'Completed').length;
      const archived = data.filter(p => p.status === 'Archived').length;
      
      return {
        total,
        active,
        draft,
        completed,
        archived,
        lastUpdated: data.length > 0 ? data[0].updated_at : null
      };
    }
  });

  // Fetch storage stats
  const { data: storageStats } = useQuery({
    queryKey: ['admin-storage-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      return {
        total: data.length,
        recentFile: data.length > 0 ? data[0].name : null
      };
    }
  });

  // Fetch newsletter stats
  const { data: newsletterStats } = useQuery({
    queryKey: ['admin-newsletter-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_queue')
        .select('id, status, updated_at')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return {
        total: data.length,
        drafts: data.filter(n => n.status === 'draft').length,
        queued: data.filter(n => n.status === 'queued').length,
        sent: data.filter(n => n.status === 'sent').length,
        lastUpdated: data.length > 0 ? data[0].updated_at : null,
      };
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1800px]">
      {/* Header */}
      <div className="mb-12">
        <h1 
          className="text-5xl font-rajdhani font-bold mb-2 relative inline-block"
          style={{ color: 'hsl(var(--color-cyan))' }}
        >
          Welcome back, Aimee ⚡
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 animate-shimmer" />
        </h1>
        <p className="text-lg font-ibm-plex text-[#e0e0e0]">
          Your AI with Aimee control center at a glance.
        </p>
        <p className="text-sm font-ibm-plex mt-2" style={{ color: 'hsl(var(--color-pink))' }}>
          Last login: {format(new Date(), 'MMM dd, yyyy HH:mm')}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          icon={FileText}
          title="Blog Posts"
          value={blogStats?.total || '—'}
          subtitle={`${blogStats?.drafts || 0} drafts, ${blogStats?.published || 0} published`}
          route="/admin/blogs"
          color="cyan"
        />
          <MetricCard
            icon={Rocket}
            title="Projects"
            value={projectStats?.total || '—'}
            subtitle={`${projectStats?.active || 0} active, ${projectStats?.draft || 0} drafts, ${projectStats?.archived || 0} archived`}
            route="/admin/project-dashboard"
            color="pink"
          />
        <MetricCard
          icon={Image}
          title="Assets"
          value={storageStats?.total || '—'}
          subtitle={storageStats?.recentFile 
            ? `Recent: ${storageStats.recentFile.substring(0, 20)}...` 
            : 'No uploads yet'}
          route="/admin/asset-gallery"
          color="yellow"
        />
        <MetricCard
          icon={Mail}
          title="Newsletters"
          value={newsletterStats?.total || '—'}
          subtitle={`${newsletterStats?.drafts || 0} drafts, ${newsletterStats?.queued || 0} queued, ${newsletterStats?.sent || 0} sent`}
          route="/admin/newsletter-logs"
          color="yellow"
        />
      </div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Recent Blogs */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(26, 11, 46, 0.65)',
            border: '2px solid hsl(var(--color-cyan) / 0.3)',
            boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.2)',
          }}
        >
          <h2 
            className="text-2xl font-rajdhani font-bold mb-6 flex items-center gap-2"
            style={{ color: 'hsl(var(--color-cyan))' }}
          >
            📰 Recent Blog Posts
          </h2>
          <div className="space-y-3">
            {recentBlogs?.map((blog, index) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/admin/blogs/edit?id=${blog.id}`)}
                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all animate-fade-in"
                style={{
                  background: 'rgba(0, 255, 255, 0.05)',
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <Dot size={16} style={{ color: blog.status === 'draft' ? '#00ffff' : '#f9f940' }} />
                <div className="flex-1">
                  <p className="font-ibm-plex text-sm text-[#e0e0e0]">
                    {blog.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span 
                      className="text-xs font-rajdhani px-2 py-0.5 rounded"
                      style={{
                        background: blog.status === 'draft' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(249, 249, 64, 0.2)',
                        color: blog.status === 'draft' ? '#00ffff' : '#f9f940',
                        border: `1px solid ${blog.status === 'draft' ? '#00ffff' : '#f9f940'}`,
                      }}
                    >
                      {blog.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-ibm-plex" style={{ color: 'hsl(var(--color-pink))' }}>
                      {format(new Date(blog.updated_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!recentBlogs || recentBlogs.length === 0) && (
              <p className="text-sm font-ibm-plex text-center py-8 text-[#888888]">
                No blog posts yet. Create your first post!
              </p>
            )}
          </div>
        </div>

        {/* Right: Recent Projects */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(26, 11, 46, 0.65)',
            border: '2px solid hsl(var(--color-pink) / 0.3)',
            boxShadow: '0 0 20px hsl(var(--color-pink) / 0.2)',
          }}
        >
          <h2 
            className="text-2xl font-rajdhani font-bold mb-6 flex items-center gap-2"
            style={{ color: 'hsl(var(--color-pink))' }}
          >
            🚀 Recent Projects
          </h2>
          <div className="space-y-3">
            {recentProjects?.map((project, index) => (
              <div
                key={project.id}
                onClick={() => navigate(`/admin/project-editor?id=${project.id}`)}
                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all animate-fade-in"
                style={{
                  background: 'rgba(245, 12, 160, 0.05)',
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 12, 160, 0.15)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 12, 160, 0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <Dot 
                  size={16} 
                  style={{ 
                    color: project.status === 'Active' ? '#f9f940' : 
                           project.status === 'Draft' ? '#00ffff' : '#888888' 
                  }} 
                />
                <div className="flex-1">
                  <p className="font-ibm-plex text-sm text-[#e0e0e0]">
                    {project.project_title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span 
                      className="text-xs font-rajdhani px-2 py-0.5 rounded"
                      style={{
                        background: project.status === 'Active' ? 'rgba(249, 249, 64, 0.2)' : 
                                   project.status === 'Draft' ? 'rgba(0, 255, 255, 0.2)' : 
                                   'rgba(136, 136, 136, 0.2)',
                        color: project.status === 'Active' ? '#f9f940' : 
                               project.status === 'Draft' ? '#00ffff' : '#888888',
                        border: `1px solid ${project.status === 'Active' ? '#f9f940' : 
                                             project.status === 'Draft' ? '#00ffff' : '#888888'}`,
                      }}
                    >
                      {project.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-ibm-plex" style={{ color: 'hsl(var(--color-pink))' }}>
                      {format(new Date(project.updated_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!recentProjects || recentProjects.length === 0) && (
              <p className="text-sm font-ibm-plex text-center py-8 text-[#888888]">
                No projects yet. Create your first project!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 
          className="text-2xl font-rajdhani font-bold mb-6"
          style={{ color: 'hsl(var(--color-cyan))' }}
        >
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={PlusCircle}
            label="New Blog Post"
            route="/admin/blogs/new"
            color="cyan"
          />
          <QuickActionButton
            icon={Upload}
            label="Upload Image"
            route="/admin/image-manager"
            color="pink"
          />
          <QuickActionButton
            icon={Rocket}
            label="Add Project"
            route="/admin/project-dashboard"
            color="yellow"
          />
          <QuickActionButton
            icon={BookOpen}
            label="Prompt Library"
            route="/admin/prompt-library"
            color="cyan"
          />
        </div>
      </div>
    </div>
  );
}
