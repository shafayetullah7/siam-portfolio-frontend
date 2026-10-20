import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { ErrorBoundary, Suspense, type JSX } from "solid-js";
import SkipLink from "~/components/SkipLink";
import RouteErrorFallback from "~/components/RouteErrorFallback";
import "./app.css";

function AppShell(props: { children: JSX.Element }) {
  return (
    <>
      <SkipLink />
      <ErrorBoundary
        fallback={(error, reset) => (
          <RouteErrorFallback error={error} reset={reset} variant="standalone" />
        )}
      >
        <Suspense>{props.children}</Suspense>
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
