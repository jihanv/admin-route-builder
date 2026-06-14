import { AdminSidebar } from "@/components/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b px-4">
          <SidebarTrigger className="text-primary hover:bg-primary! hover:text-sidebar!" />
          <div className="h-4 w-px bg-border" />
          <DashboardBreadcrumb />
        </header>
        <main className="min-h-screen bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
