import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import PasswordGate from '@/components/admin/PasswordGate';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AboutBackground from '@/components/AboutBackground';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <PasswordGate>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full relative">
          <AboutBackground />
          
          <AdminSidebar />
          
          <main className="flex-1 relative z-10">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </PasswordGate>
  );
}
