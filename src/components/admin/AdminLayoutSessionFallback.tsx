import PageLoading from "~/components/PageLoading";

/** Suspense fallback while `getAdminSession` resolves (matches pre-chrome loading band). */
export default function AdminLayoutSessionFallback() {
  return (
    <div class="flex min-h-screen flex-col bg-canvas">
      <main id="main" class="flex flex-1 flex-col justify-center">
        <div class="mx-auto w-full max-w-md">
          <PageLoading compact />
        </div>
      </main>
    </div>
  );
}
