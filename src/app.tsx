import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { ErrorBoundary, Suspense } from "solid-js";
import Nav from "~/components/Nav";
import SkipLink from "~/components/SkipLink";
import RouteErrorFallback from "~/components/RouteErrorFallback";
import PageLoading from "~/components/PageLoading";
import PublicShell from "~/components/PublicShell";
import { PublicSiteProvider } from "~/lib/site/PublicSiteProvider";
import "./app.css";

function AppShell(props: { children: unknown }) {
  const location = useLocation();
  const isAdmin = () => location.pathname.startsWith("/admin");

  const routeContent = (
    <ErrorBoundary
      fallback={(error, reset) => (
        <RouteErrorFallback error={error} reset={reset} />
      )}
    >
      <Suspense fallback={<PageLoading />}>
        {isAdmin() ? (
          props.children
        ) : (
          <PublicSiteProvider>
            <Nav />
            <PublicShell>{props.children}</PublicShell>
          </PublicSiteProvider>
        )}
      </Suspense>
    </ErrorBoundary>
  );

  return (
    <>
      <SkipLink />
      {routeContent}
    </>
  );
}

export default function App() {
  return (
    <MetaProvider>
      <Router
        root={props => (
          <AppShell>{props.children}</AppShell>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
