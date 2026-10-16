import { ErrorBoundary, Suspense, type JSX } from "solid-js";
import PageLoading from "./PageLoading";
import RouteErrorFallback from "./RouteErrorFallback";

/** Per-route async shell — F3 routes can wrap content; root app.tsx uses the same primitives globally. */
export default function AsyncRouteShell(props: { children: JSX.Element }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <RouteErrorFallback error={error} reset={reset} />
      )}
    >
      <Suspense fallback={<PageLoading />}>{props.children}</Suspense>
    </ErrorBoundary>
  );
}
