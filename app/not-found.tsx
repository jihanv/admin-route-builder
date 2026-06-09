export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-32 items-center justify-center gap-3 rounded-lg border bg-card">
        <div className="h-10 w-3 rotate-12 rounded-sm bg-orange-300" />
        <div className="h-10 w-3 rotate-12 rounded-sm bg-orange-300" />
        <div className="h-10 w-3 rotate-12 rounded-sm bg-orange-300" />
      </div>
      <h1 className="text-3xl font-bold">Site Under Construction</h1>
      <p className="max-w-md text-muted-foreground">
        This admin page is not ready yet. We are still building this part of REI
        Mission.
      </p>
    </main>
  );
}
