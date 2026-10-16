import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import SkipLink from "~/components/SkipLink";
import "./app.css";

function AppShell(props: { children: unknown }) {
  const location = useLocation();
  const isAdmin = () => location.pathname.startsWith("/admin");

  return (
    <>
      <SkipLink />
      {!isAdmin() && <Nav />}
      <Suspense>{props.children}</Suspense>
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
