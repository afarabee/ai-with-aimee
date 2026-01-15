import { FileText, Image, Brain, Mail, MailOpen, BarChart3, LogOut, ArrowLeft, LayoutDashboard, Rocket, Map, Bot, FlaskConical, ChevronDown } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { useState } from 'react';

const adminModules = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    description: 'Overview & quick actions',
  },
  {
    title: 'Blogs',
    url: '/admin/blogs',
    icon: FileText,
    description: 'Create and manage blog posts (new)',
  },
  {
    title: 'Project Management',
    url: '/admin/project-dashboard',
    icon: Rocket,
    description: 'Manage AI projects and applied work',
  },
  {
    title: 'Asset Library',
    url: '/admin/asset-gallery',
    icon: Image,
    description: 'Manage uploaded brand and blog images',
    disabled: false,
  },
  {
    title: 'Prompt Library',
    url: '/admin/prompt-library',
    icon: Brain,
    description: 'Manage AI prompts and templates',
    disabled: false,
  },
  {
    title: 'Newsletter Dashboard',
    url: '/admin/newsletter-dashboard',
    icon: Mail,
    description: 'Curate content for newsletter assembly',
    disabled: false,
  },
  {
    title: 'Newsletter Composer',
    url: '/admin/newsletter-composer',
    icon: Mail,
    description: 'Craft and schedule newsletters',
    disabled: false,
  },
  {
    title: 'Newsletter Logs',
    url: '/admin/newsletter-logs',
    icon: MailOpen,
    description: 'View all saved and sent newsletters',
    disabled: false,
  },
  {
    title: 'AI Dashboard',
    url: '/admin/ai-metrics',
    icon: BarChart3,
    description: 'Model performance & evals',
    disabled: true,
  },
];

const modelMapModules = [
  { title: 'My Models', url: '/admin/models', icon: Bot },
  { title: 'Prompt Library', url: '/admin/prompt-library', icon: Brain },
  { title: 'Test Lab', url: '/admin/test-lab', icon: FlaskConical },
  { title: 'My Model Map', url: '/admin/model-map', icon: Map },
];

export default function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const navGuard = useNavigationGuard();
  const [modelMapOpen, setModelMapOpen] = useState(
    modelMapModules.some(m => location.pathname.startsWith(m.url))
  );
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return path !== '/admin' && location.pathname.startsWith(path);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string, disabled: boolean) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (navGuard.isDirty && url !== location.pathname) {
      e.preventDefault();
      navGuard.setPendingNavigation(url);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    navigate('/admin');
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
              {adminModules.filter(m => m.url !== '/admin/prompt-library').map((item) => (
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
                      onClick={(e) => handleNavClick(e, item.url, item.disabled || false)}
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

              {/* Model Map Collapsible Section */}
              <Collapsible open={modelMapOpen} onOpenChange={setModelMapOpen}>
                <CollapsibleTrigger className="w-full">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-md transition-all cursor-pointer ${
                      modelMapModules.some(m => isActive(m.url))
                        ? 'bg-pink-500/20 border-l-4 border-pink-400'
                        : 'hover:bg-pink-500/10'
                    }`}
                    style={{
                      color: modelMapModules.some(m => isActive(m.url))
                        ? 'hsl(var(--color-pink))'
                        : 'hsl(var(--color-light-text))',
                    }}
                  >
                    <Map className="h-5 w-5 flex-shrink-0" />
                    {open && (
                      <>
                        <span className="font-rajdhani flex-1 text-left">Model Map</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${modelMapOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-4 mt-1 space-y-1">
                    {modelMapModules.map((item) => (
                      <NavLink
                        key={item.url}
                        to={item.url}
                        onClick={(e) => handleNavClick(e, item.url, false)}
                        className={`flex items-center gap-3 p-2 rounded-md transition-all ${
                          isActive(item.url)
                            ? 'bg-cyan-500/20 text-[hsl(var(--color-cyan))]'
                            : 'hover:bg-cyan-500/10 text-[hsl(var(--color-light-text))]'
                        }`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {open && <span className="font-rajdhani text-sm">{item.title}</span>}
                      </NavLink>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
