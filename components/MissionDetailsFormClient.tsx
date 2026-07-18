"use client";

import { useState } from "react";

export function MissionDetailsFormClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [heroBannerFile, setHeroBannerFile] = useState<File | null>(null);

  return <>{children}</>;
}
