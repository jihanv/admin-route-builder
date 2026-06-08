import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { AdminSidebarMenuGroup } from "@/components/AdminSidebarMenuGroup";

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <div className="flex h-12 items-center gap-2 px-3">
        <div className="flex size-8 shrink-0 items-center justify-center">
          <Image src="/rei-logo.ico" alt="REI" width={32} height={32} />
        </div>
        <span className="truncate whitespace-nowrap font-semibold group-data-[collapsible=icon]:hidden">
          REI Mission
        </span>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            <AdminSidebarMenuGroup
              title="Missions"
              items={[
                { label: "Create New Mission", href: "/admin" },
                { label: "Current Missions", href: "/admin/missions" },
                { label: "Draft Missions", href: "/admin/missions/drafts" },
              ]}
            />
            <AdminSidebarMenuGroup
              title="Users"
              items={[
                {
                  label: "Active Mission Participants",
                  href: "/admin/users/active",
                },
                { label: "All Users", href: "/admin/users" },
                { label: "User Progress", href: "/admin/users/progress" },
              ]}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
