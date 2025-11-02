import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import PasswordGate from '@/components/admin/PasswordGate';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AboutBackground from '@/components/AboutBackground';
import AdminChatPanel from '@/components/admin/AdminChatPanel';
import AdminChatOrb from '@/components/admin/AdminChatOrb';
import { AdminChatProvider } from '@/context/AdminChatContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <PasswordGate>
      <AdminChatProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full relative">
            <AboutBackground />
            
            <AdminSidebar />
            
            <main className="flex-1 relative z-10">
              {children}
            </main>
            
            <AdminChatPanel />
            <AdminChatOrb />
          </div>
        </SidebarProvider>
      </AdminChatProvider>
    </PasswordGate>
  );
}
