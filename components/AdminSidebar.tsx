import { Sidebar } from "@/components/ui/sidebar";
import Image from "next/image";

export function AdminSidebar() {
  return (
    <Sidebar>
      <div className="flex h-12 items-center gap-2 px-3">
        <Image src="/rei-logo.ico" alt="REI" width={32} height={32} />
        <span className="font-semibold">REI Mission</span>
      </div>
    </Sidebar>
  );
}
