import { auth } from "@clerk/nextjs/server";
import { getMission } from "@/lib/getMission";
import { ReviewRouteMap } from "@/components/ReviewRouteMap";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { formatDateOnly } from "@/lib/formatters";

export default async function MissionPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;
  const { userId, sessionClaims } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (!userId || adminRole !== "admin") {
    return <div className="p-8">Access denied.</div>;
  }

  const mission = await getMission(missionId);

  if (!mission) {
    return <div className="p-8">Mission does not exist.</div>;
  }

  return (
    <section className="mx-auto w-full max-w-screen-2xl space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{mission.title}</h1>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium capitalize text-primary">
          {mission.status}
        </span>
      </div>
      <p className="max-w-3xl text-muted-foreground">
        {mission.description || "No description provided."}
      </p>
      <div className="grid divide-y rounded-xl border bg-card sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <div className="p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Start date
          </p>
          <p className="mt-1 font-semibold">
            {formatDateOnly(mission.startDate)}
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            End date
          </p>
          <p className="mt-1 font-semibold">
            {formatDateOnly(mission.endDate)}
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Distance
          </p>
          <p className="mt-1 font-semibold">
            {(mission.goalDistanceMeters / 1000).toFixed(2)} km
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Milestones
          </p>
          <p className="mt-1 font-semibold">{mission.milestones.length}</p>
        </div>
      </div>
      <div className="space-y-4 rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Route overview</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">View Milestones</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Mission milestones</SheetTitle>
                <SheetDescription>
                  {mission.milestones.length} milestones on this route.
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                {mission.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <p className="font-medium">{milestone.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(milestone.distanceMeters / 1000).toFixed(2)} km from
                      start
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {milestone.description || "No description provided."}
                    </p>
                    {milestone.imageUrls[0] ? (
                      <Image
                        src={milestone.imageUrls[0]}
                        alt={`Image for ${milestone.title}`}
                        width={384}
                        height={128}
                        className="mt-3 h-32 w-full rounded-md border object-cover"
                        unoptimized
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <ReviewRouteMap
          routePoints={mission.routePoints}
          snappedRoutePoints={mission.snappedRoutePoints}
          milestones={mission.milestones}
        />
      </div>
    </section>
  );
}
