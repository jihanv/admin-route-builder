import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import { AdminSidebarMenuGroup } from "@/components/AdminSidebarMenuGroup";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <div className="flex h-12 items-center gap-2 px-3">
        <div className="flex size-8 shrink-0 items-center justify-center">
          <Image
            src="/rei-logo.ico"
            alt="REI"
            width={32}
            height={32}
            className="size-8"
          />
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
                { label: "Create New Mission", href: "/dashboard/mission/new" },
                {
                  label: "Current Missions",
                  href: "/dashboard/mission/current",
                },
                { label: "Draft Missions", href: "/dashboard/mission/drafts" },
              ]}
            />
            <AdminSidebarMenuGroup
              title="Users"
              items={[
                {
                  label: "Active Mission Participants",
                  href: "/dashboard/users/active",
                },
                { label: "All Users", href: "/dashboard/users" },
                { label: "User Progress", href: "/dashboard/users/progress" },
              ]}
            />
            <AdminSidebarMenuGroup
              title="Communication"
              items={[
                {
                  label: "Announcements",
                  href: "/dashboard/communication/announcements",
                },
                {
                  label: "Push Notifications",
                  href: "/dashboard/communication/push",
                },
                {
                  label: "Message History",
                  href: "/dashboard/communication/history",
                },
              ]}
            />
            <SidebarMenuItem className="overflow-hidden opacity-100 transition-opacity delay-150 duration-150 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0">
              <SidebarMenuButton
                asChild
                className="hover:bg-sidebar-foreground! hover:text-sidebar!"
              >
                <Link href="/dashboard/settings">Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-2 px-2 py-2">
          <UserButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
