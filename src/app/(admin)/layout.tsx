import type { ReactNode } from 'react';

import { AppSidebar } from '~/common/components/app-sidebar';
import {
  SidebarProvider,
  SidebarTrigger,
} from '~/common/components/ui/sidebar';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex h-14 items-center p-2">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
