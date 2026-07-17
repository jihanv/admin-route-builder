import { getMission } from "@/lib/getMission";

export default async function MissionPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;
  const mission = await getMission(missionId);

  if (!mission) {
    return <div className="p-8">Mission does not exist.</div>;
  }

  return (
    <section className="space-y-4 p-8">
      <h1 className="text-2xl font-semibold">{mission.title}</h1>
    </section>
  );
}
