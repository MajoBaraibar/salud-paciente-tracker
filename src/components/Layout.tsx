
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/NotificationCenter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full" style={{ background: 'linear-gradient(135deg, hsl(220 90% 35%), hsl(220 90% 45%))' }}>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-svh flex flex-col bg-background/90 backdrop-blur-sm">
            <div className="bg-primary/10 p-4 border-b border-primary/20">
              <div className="flex justify-end">
                <NotificationCenter />
              </div>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-card rounded-xl shadow-lg border border-accent/30 p-6 h-full">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
