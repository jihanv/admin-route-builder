import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type AdminSidebarMenuGroupProps = {
  title: string;
  items: { label: string; href: string }[];
};

export function AdminSidebarMenuGroup({
  title,
  items,
}: AdminSidebarMenuGroupProps) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem className="overflow-hidden opacity-100 transition-opacity delay-150 duration-150 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="hover:bg-sidebar-foreground! hover:text-sidebar!">
            <span>{title}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton
                  asChild
                  className="hover:bg-sidebar-foreground! hover:text-sidebar!"
                >
                  <Link href={item.href}>{item.label}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
