
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="bg-background min-h-svh">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
