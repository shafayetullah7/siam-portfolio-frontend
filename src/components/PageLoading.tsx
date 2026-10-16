export default function PageLoading() {
  return (
    <div class="siam-container py-16" role="status" aria-live="polite">
      <div class="max-w-md animate-pulse space-y-3">
        <div class="h-3 w-24 rounded bg-border" />
        <div class="h-8 w-full max-w-sm rounded bg-border" />
        <div class="h-4 w-full rounded bg-border" />
        <div class="h-4 w-5/6 rounded bg-border" />
      </div>
      <p class="sr-only">Loading</p>
    </div>
  );
}
