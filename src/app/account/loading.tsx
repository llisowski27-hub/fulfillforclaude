export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-32 bg-secondary rounded animate-pulse" />
        <div className="h-4 w-48 bg-secondary rounded animate-pulse" />
      </div>
      <div className="mb-6 h-12 rounded-xl bg-card border border-border animate-pulse" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-6 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-secondary rounded" />
                <div className="h-3 w-32 bg-secondary rounded" />
              </div>
              <div className="h-6 w-20 bg-secondary rounded-full" />
            </div>
            <div className="border-t border-border pt-4 flex justify-between">
              <div className="h-4 w-24 bg-secondary rounded" />
              <div className="h-5 w-28 bg-secondary rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
