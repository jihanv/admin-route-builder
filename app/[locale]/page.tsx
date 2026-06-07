import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignIn routing="hash" forceRedirectUrl="/admin" />
    </main>
  );
}
