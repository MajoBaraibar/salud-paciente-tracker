
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/NotificationCenter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="min-h-svh flex flex-col">
            <div className="flex justify-end p-4 glass-effect border-b border-white/10">
              <NotificationCenter />
            </div>
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
