import { ErrorBoundary, Suspense, type JSX } from "solid-js";
import PageLoading from "./PageLoading";
import RouteErrorFallback from "./RouteErrorFallback";

export type AsyncRouteShellProps = {
  children: JSX.Element;
  /** Passed to PageLoading when route content suspends */
  compactLoading?: boolean;
};

/** Per-route async shell — keeps parent chrome (nav/footer) outside Suspense. */
export default function AsyncRouteShell(props: AsyncRouteShellProps) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <RouteErrorFallback error={error} reset={reset} variant="embedded" />
      )}
    >
      <Suspense fallback={<PageLoading compact={props.compactLoading} />}>
        {props.children}
      </Suspense>
    </ErrorBoundary>
  );
}
