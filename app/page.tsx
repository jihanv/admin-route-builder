import { Show, SignInButton, UserButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Admin Route Builder
      </h1>
      <Show when="signed-out">
        <SignInButton />
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </main>
  );
}
