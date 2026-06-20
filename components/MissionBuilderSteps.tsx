import {
  missionBuilderSteps,
  type MissionBuilderStepId,
} from "@/types/builderSteps";

export function MissionBuilderSteps({
  currentStepId,
}: {
  currentStepId: MissionBuilderStepId;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {missionBuilderSteps.map((step, index) => (
        <span
          key={step.id}
          className={
            step.id === currentStepId
              ? "font-semibold text-primary"
              : "text-muted-foreground"
          }
        >
          {index + 1}. {step.label}
        </span>
      ))}
    </div>
  );
}
