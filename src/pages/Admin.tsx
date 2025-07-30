
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PaymentTracker } from "@/components/admin/PaymentTracker";

const Admin = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <PaymentTracker />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
