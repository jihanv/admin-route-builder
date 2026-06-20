import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">REI Mission Builder</h1>
      <Button asChild className="mt-4">
        <Link href="/dashboard/createNewMission">Create New Mission</Link>
      </Button>
    </main>
  );
}
