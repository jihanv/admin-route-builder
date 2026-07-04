export default async function MilestoneContentPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;

  return <div>Milestone content page for draft: {draftId}</div>;
}
