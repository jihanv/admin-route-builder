import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

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
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem className="overflow-hidden opacity-100 transition-opacity delay-150 duration-150 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="hover:!bg-sidebar-foreground hover:!text-sidebar">
                    <span>Missions</span>
                    <ChevronRight className="ml-auto size-4" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="hover:!bg-sidebar-foreground hover:!text-sidebar"
                      >
                        <Link href="/admin">Create New Mission</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
