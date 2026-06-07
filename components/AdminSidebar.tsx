import { Sidebar } from "@/components/ui/sidebar";
import Image from "next/image";

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
    </Sidebar>
  );
}
