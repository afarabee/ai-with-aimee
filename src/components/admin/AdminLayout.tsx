import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import PasswordGate from '@/components/admin/PasswordGate';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AboutBackground from '@/components/AboutBackground';
import { NavigationGuardProvider } from '@/hooks/useNavigationGuard';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <PasswordGate>
      <NavigationGuardProvider>
        <SidebarProvider defaultOpen={true}>
          <AboutBackground />
          <AdminSidebar />
          <main className="flex-1 relative z-10 min-h-screen">
            {children}
          </main>
        </SidebarProvider>
      </NavigationGuardProvider>
    </PasswordGate>
  );
}
