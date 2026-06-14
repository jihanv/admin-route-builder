"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  mission: "Missions",
  new: "Create New Mission",
  current: "Current Missions",
  drafts: "Draft Missions",
  users: "Users",
  active: "Active Mission Participants",
  progress: "User Progress",
  communication: "Communication",
  announcements: "Announcements",
  push: "Push Notifications",
  history: "Message History",
  settings: "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm font-medium">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = labelMap[segment] ?? segment;
        const isLast = index === segments.length - 1;

        return isLast ? (
          <span key={href}>{label}</span>
        ) : (
          <span key={href}>
            <Link href={href}>{label}</Link>
            <span className="mx-2 text-muted-foreground">/</span>
          </span>
        );
      })}
    </nav>
  );
}
