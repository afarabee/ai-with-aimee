import { FileText, Image, Brain, Mail, BarChart3, LogOut, ArrowLeft, LayoutDashboard, Rocket } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { toast } from 'sonner';

const adminModules = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    description: 'Overview & quick actions',
  },
  {
    title: 'Blog Management',
    url: '/admin/blog-dashboard',
    icon: FileText,
    description: 'Create and manage blog posts',
  },
  {
    title: 'Project Management',
    url: '/admin/project-dashboard',
    icon: Rocket,
    description: 'Manage AI projects and applied work',
  },
  {
    title: 'Asset Gallery',
    url: '/admin/assets',
    icon: Image,
    description: 'Upload and organize images',
    disabled: true,
  },
  {
    title: 'Prompt Library',
    url: '/admin/prompts',
    icon: Brain,
    description: 'Manage AI prompts and templates',
    disabled: true,
  },
  {
    title: 'Newsletter Logs',
    url: '/admin/newsletter',
    icon: Mail,
    description: 'View pipeline activity',
    disabled: true,
  },
  {
    title: 'AI Dashboard',
    url: '/admin/ai-metrics',
    icon: BarChart3,
    description: 'Model performance & evals',
    disabled: true,
  },
];

export default function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    // Exact match for dashboard
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    // Prefix match for other routes
    return path !== '/admin' && location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/');
    toast.info('Logged out successfully', {
      style: {
        background: 'rgba(0, 255, 255, 0.1)',
        border: '1px solid hsl(var(--color-cyan))',
        color: 'hsl(var(--color-cyan))',
      },
    });
  };

  return (
    <Sidebar
      className="transition-all duration-300"
      style={{
        width: open ? '240px' : '56px',
        background: 'rgba(26, 11, 46, 0.8)',
        borderRight: '2px solid hsl(var(--color-cyan) / 0.3)',
      }}
      collapsible="icon"
    >
      <SidebarTrigger 
        className="m-2 self-end"
        style={{ color: 'hsl(var(--color-cyan))' }}
      />
      
      <SidebarContent>
        {/* Logo/Branding with Return to Website link */}
        <div className="p-4 border-b border-cyan-500/20">
          {open ? (
            <>
              <h2 
                className="text-xl font-rajdhani font-bold mb-2"
                style={{ color: 'hsl(var(--color-cyan))' }}
              >
                🧠 Admin Center
              </h2>
              <NavLink
                to="/"
                className="text-sm font-rajdhani transition-all hover:underline"
                style={{ color: 'hsl(var(--color-pink))' }}
              >
                ← Return to Website
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/"
              title="Return to Website"
              className="flex justify-center"
              style={{ color: 'hsl(var(--color-pink))' }}
            >
              <ArrowLeft className="h-5 w-5" />
            </NavLink>
          )}
        </div>

        {/* Navigation Items */}
        <SidebarGroup>
          <SidebarGroupLabel style={{ color: 'hsl(var(--color-cyan))' }}>
            {open ? 'Modules' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    disabled={item.disabled}
                    title={item.disabled ? 'Coming Soon' : item.description}
                    className="transition-all duration-300"
                    style={{
                      opacity: item.disabled ? 0.5 : 1,
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <NavLink 
                      to={item.disabled ? '#' : item.url}
                      onClick={(e) => item.disabled && e.preventDefault()}
                      className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                        isActive(item.url) && !item.disabled
                          ? 'bg-cyan-500/20 border-l-4 border-cyan-400'
                          : 'hover:bg-cyan-500/10'
                      }`}
                      style={{
                        color: isActive(item.url) && !item.disabled 
                          ? 'hsl(var(--color-cyan))' 
                          : 'hsl(var(--color-light-text))',
                        boxShadow: isActive(item.url) && !item.disabled
                          ? '0 0 20px rgba(0, 255, 255, 0.3)'
                          : 'none',
                        textShadow: isActive(item.url) && !item.disabled
                          ? '0 0 8px rgba(0, 255, 255, 0.6)'
                          : 'none',
                      }}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span className="font-rajdhani">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button (bottom) */}
        <div className="mt-auto p-4 border-t border-cyan-500/20">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${open ? 'gap-2' : 'justify-center'} p-3 rounded-md transition-all hover:shadow-[0_0_20px_rgba(245,12,160,0.4)]`}
            style={{
              background: 'rgba(245, 12, 160, 0.15)',
              border: '2px solid hsl(var(--color-pink))',
              color: 'hsl(var(--color-pink))',
            }}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {open && <span className="font-rajdhani">Logout</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
