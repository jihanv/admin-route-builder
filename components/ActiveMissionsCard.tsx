"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPinned } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrencyFromCents } from "@/lib/formatters";

const MISSIONS_PER_PAGE = 3;

type ActiveMission = {
  id: string;
  title: string;
  endDate: string;
  amountRaisedCents: number;
  fundraisingGoalCents: number;
  fundraisingPercentage: number;
};

type ActiveMissionsCardProps = {
  missions: ActiveMission[];
  className?: string;
};

function formatMissionEndDate(endDate: string) {
  return new Date(`${endDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ActiveMissionsCard({
  missions,
  className,
}: ActiveMissionsCardProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const pageCount = Math.max(1, Math.ceil(missions.length / MISSIONS_PER_PAGE));

  const currentPageIndex = Math.min(pageIndex, pageCount - 1);

  const visibleMissions = missions.slice(
    currentPageIndex * MISSIONS_PER_PAGE,
    currentPageIndex * MISSIONS_PER_PAGE + MISSIONS_PER_PAGE,
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <MapPinned
            aria-hidden="true"
            className="size-9 rounded-lg bg-primary/10 p-2 text-primary"
          />
          Active Missions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        {missions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No missions are active today.
          </p>
        ) : (
          <div className="divide-y">
            {visibleMissions.map((mission) => (
              <Link
                key={mission.id}
                href="/dashboard/mission/current"
                className="grid grid-cols-[2.5rem_1fr_auto] gap-x-3 gap-y-1 rounded-lg py-5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="row-span-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPinned
                    aria-hidden="true"
                    className="size-5 text-primary"
                  />
                </span>

                <span className="min-w-0 truncate font-medium">
                  {mission.title}
                </span>

                <span className="font-semibold">
                  {mission.fundraisingPercentage}%
                </span>

                <span className="text-sm text-muted-foreground">
                  {formatCurrencyFromCents(mission.amountRaisedCents)} raised of{" "}
                  {formatCurrencyFromCents(mission.fundraisingGoalCents)}
                </span>

                <span className="col-span-2 col-start-2 h-2 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(mission.fundraisingPercentage, 100)}%`,
                    }}
                  />
                </span>

                <span className="col-start-2 text-xs text-muted-foreground">
                  Ends {formatMissionEndDate(mission.endDate)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>

      {missions.length > MISSIONS_PER_PAGE ? (
        <CardFooter className="mt-auto justify-between">
          <span className="text-xs text-muted-foreground">
            Page {currentPageIndex + 1} of {pageCount}
          </span>

          <div className="flex gap-2">
            {currentPageIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPageIndex((currentPage) => currentPage - 1)}
              >
                <ChevronLeft aria-hidden="true" />
                Previous
              </Button>
            ) : null}

            {currentPageIndex < pageCount - 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPageIndex((currentPage) => currentPage + 1)}
              >
                Next
                <ChevronRight aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
