import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { ErrorBoundary, Suspense, type JSX } from "solid-js";
import SkipLink from "~/components/SkipLink";
import RouteErrorFallback from "~/components/RouteErrorFallback";
import PageLoading from "~/components/PageLoading";
import "./app.css";

function AppShell(props: { children: JSX.Element }) {
  return (
    <>
      <SkipLink />
      <ErrorBoundary
        fallback={(error, reset) => (
          <RouteErrorFallback error={error} reset={reset} />
        )}
      >
        <Suspense fallback={<PageLoading />}>{props.children}</Suspense>
      </ErrorBoundary>
    </>
  );
}

export default function App() {
  return (
    <MetaProvider>
      <Router root={(props) => <AppShell>{props.children}</AppShell>}>
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
