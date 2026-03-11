import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b border-border px-6 bg-card/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="mr-2" />
              <div className="hidden sm:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search anything..."
                  className="pl-9 w-64 bg-muted/50 border-transparent focus:border-border"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground">3</span>
              </Button>
              <div className="h-9 w-9 rounded-full gradient-emerald flex items-center justify-center text-primary-foreground font-semibold text-sm">
                A
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
