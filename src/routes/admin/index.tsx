import EmptyState from "~/components/EmptyState";

export default function AdminHome() {
  return (
    <div>
      <h1 class="text-2xl font-bold text-ink">CMS shell</h1>
      <p class="mt-2 text-ink-muted">
        Owner tools will live here after Phase 5 (auth) and content phases.
      </p>
      <div class="mt-8 max-w-lg">
        <EmptyState
          title="No modules yet"
          description="Dashboard, editors, and media library connect in later phases."
        />
      </div>
    </div>
  );
}
