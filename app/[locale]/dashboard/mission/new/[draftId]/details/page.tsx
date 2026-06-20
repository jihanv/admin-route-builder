import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function MissionDetailsPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  const { sessionClaims } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") {
    return (
      <section className="p-8">
        <h1 className="text-2xl font-semibold text-primary">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to view this mission draft.
        </p>
      </section>
    );
  }
  const draftSnapshot = await adminDb
    .collection("routeDrafts")
    .doc(draftId)
    .get();

  if (!draftSnapshot.exists) {
    return (
      <section className="p-8">
        <h1 className="text-2xl font-semibold text-primary">
          Mission does not exist
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This mission draft may have been deleted or the link is incorrect.
        </p>
      </section>
    );
  }
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="mission-details" />
      <h1 className="text-2xl font-semibold text-primary">Mission Details</h1>
      <p className="text-sm text-muted-foreground">Draft ID: {draftId}</p>
    </section>
  );
}
