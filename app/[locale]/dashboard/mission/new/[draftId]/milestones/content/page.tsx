import { auth } from "@clerk/nextjs/server";
export default async function MilestoneContentPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  const { sessionClaims } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") {
    return <div>Access denied</div>;
  }

  return <div>Milestone content page for draft: {draftId}</div>;
}
