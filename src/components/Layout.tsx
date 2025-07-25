
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/NotificationCenter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="bg-background min-h-svh flex flex-col">
            <div className="flex justify-end p-4">
              <NotificationCenter />
            </div>
            <div className="flex-1">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
