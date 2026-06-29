import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MilestoneFormProps = {
  draftId?: string;
};

export function MilestoneForm({ draftId }: MilestoneFormProps) {
  return (
    <form className="space-y-3 rounded-lg border bg-card p-4">
      <input type="hidden" name="draftId" value={draftId} />
      <h2 className="text-lg font-semibold">Add Milestone</h2>
      <Input name="title" placeholder="Milestone title" />
      <Textarea name="description" placeholder="Milestone description" />
      <Input
        name="distanceMeters"
        type="number"
        placeholder="Distance in meters"
      />
      <Button type="submit">Add Milestone</Button>
    </form>
  );
}
