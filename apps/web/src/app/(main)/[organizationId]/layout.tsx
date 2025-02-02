import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/sidebar/ui/sidebar';
import { Topbar } from '@/components/topbar/topbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />

        <div className='mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-4 p-4'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
