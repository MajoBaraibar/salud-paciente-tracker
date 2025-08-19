
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/NotificationCenter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-svh flex flex-col">
            <div className="premium-gradient p-4">
              <div className="flex justify-end">
                <NotificationCenter />
              </div>
            </div>
            <div className="flex-1 p-6" style={{ background: 'var(--gradient-subtle)' }}>
              <div className="premium-card p-6 h-full">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
