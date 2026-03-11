import {
  LayoutDashboard,
  Package,
  Hotel,
  ClipboardList,
  MessageSquare,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Packages", url: "/admin/packages", icon: Package },
  { title: "Hotels", url: "/admin/hotels", icon: Hotel },
  { title: "Bookings", url: "/admin/bookings", icon: ClipboardList },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo / Brand */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-gold flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-display text-sm font-bold text-sidebar-foreground leading-tight">Alhabib</h2>
                <p className="text-[11px] text-sidebar-foreground/60">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="flex-1 pt-4">
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest mb-1">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className={`transition-all duration-200 rounded-lg hover:bg-sidebar-accent/50 ${active ? "bg-sidebar-accent shadow-sm" : ""}`}
                        activeClassName={active ? "text-sidebar-primary font-semibold" : ""}
                      >
                        <item.icon className={`mr-2 h-4 w-4 transition-colors ${active ? "text-sidebar-primary" : "text-sidebar-foreground/60"}`} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pb-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="hover:bg-sidebar-accent/50 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Back to Site</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
