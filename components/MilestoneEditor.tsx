"use client";
import { useRouter } from "next/navigation";
import { saveRouteDraft } from "@/lib/routeDraftApi";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MilestonePickerMap,
  type SelectedMilestonePosition,
} from "@/components/MilestonePickerMap";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";
type MilestoneEditorProps = {
  goalDistanceMeters: number;

  draftId: string;
  routePoints: RoutePoint[];
  snapToRoads: boolean;
  milestones: MissionMilestone[];
  snappedRoutePoints: RoutePoint[];
};

function formatDistance(distanceMeters: number) {
  return `${distanceMeters} meters`;
}

export function MilestoneEditor({
  draftId,
  routePoints,
  snapToRoads,
  milestones,
  goalDistanceMeters,
  snappedRoutePoints,
}: MilestoneEditorProps) {
  const [selectedPositions, setSelectedPositions] = useState<
    SelectedMilestonePosition[]
  >(() =>
    milestones.map((milestone) => ({
      ...milestone.position,
      distanceMeters: milestone.distanceMeters,
      routePathIndex: milestone.distanceMeters,
      temporaryId: milestone.id,
    })),
  );
  const router = useRouter();
  const [isSavingMilestonePositions, setIsSavingMilestonePositions] =
    useState(false);

  const handleSaveMilestonePositions = async (
    positionsToSave: SelectedMilestonePosition[],
  ) => {
    setIsSavingMilestonePositions(true);

    const nextMilestones = positionsToSave.map((position) => {
      const existingMilestone = milestones.find(
        (milestone) => milestone.id === position.temporaryId,
      );

      return {
        id: position.temporaryId,
        title: existingMilestone?.title ?? "",
        description: existingMilestone?.description ?? "",
        distanceMeters: position.distanceMeters,
        position: {
          latitude: position.latitude,
          longitude: position.longitude,
        },
        imageUrls: existingMilestone?.imageUrls ?? [],
      };
    });

    try {
      const response = await saveRouteDraft({
        id: draftId,
        milestones: nextMilestones,
        milestoneImageAssets: positionsToSave.length === 0 ? [] : undefined,
        milestonesLockedAt: new Date().toISOString(),
      });

      if (!response.ok) {
        toast.error("Could not save milestone positions.");
        return;
      }

      router.push(
        positionsToSave.length === 0
          ? `/dashboard/missions/new/${draftId}/review`
          : `/dashboard/missions/new/${draftId}/milestones/content`,
      );
    } catch (error) {
      console.error("Save milestone positions failed:", error);
      toast.error("Could not save milestone positions.");
    } finally {
      setIsSavingMilestonePositions(false);
    }
  };
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0">
        <MilestonePickerMap
          goalDistanceMeters={goalDistanceMeters}
          routePoints={routePoints}
          snapToRoads={snapToRoads}
          selectedPositions={selectedPositions}
          onSelectedPositionsChange={setSelectedPositions}
          snappedRoutePoints={snappedRoutePoints}
        />
      </div>

      <aside className="flex h-100 flex-col gap-4 overflow-hidden rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Selected milestone points: {selectedPositions.length}
        </p>
        <Button
          variant="secondary"
          onClick={() => setSelectedPositions([])}
          disabled={selectedPositions.length === 0}
        >
          Clear selected points
        </Button>
        <ol className="min-h-0 w-full flex-1 space-y-2 overflow-y-auto pr-2 text-sm">
          {selectedPositions.map((position, index) => (
            <li
              key={position.temporaryId}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-sm"
            >
              <div>
                <p className="font-medium">
                  Milestone {String.fromCharCode(65 + index)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistance(position.distanceMeters)} from start
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setSelectedPositions((currentPositions) =>
                    currentPositions.filter(
                      (item) => item.temporaryId !== position.temporaryId,
                    ),
                  )
                }
              >
                Remove
              </Button>
            </li>
          ))}
        </ol>
        <Button
          onClick={() => handleSaveMilestonePositions(selectedPositions)}
          disabled={
            selectedPositions.length === 0 || isSavingMilestonePositions
          }
        >
          {isSavingMilestonePositions
            ? "Saving milestone positions..."
            : "Continue to milestone details"}
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSaveMilestonePositions([])}
          disabled={selectedPositions.length > 0 || isSavingMilestonePositions}
        >
          Skip milestones
        </Button>

        {/* <MilestoneList milestones={milestones} /> */}
      </aside>
    </div>
  );
}
