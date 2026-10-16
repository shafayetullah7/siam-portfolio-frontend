export type PageLoadingProps = {
  /** Less padding when shown inside layout main#main */
  compact?: boolean;
};

export default function PageLoading(props: PageLoadingProps) {
  const containerClass = props.compact ? "siam-container py-8" : "siam-container py-16";

  return (
    <div class={containerClass} role="status" aria-live="polite">
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
