import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore node builtin, server side only
import { appendFileSync } from "node:fs";
import { ErrorBoundary, sharedConfig, Suspense, type JSX } from "solid-js";
import { isServer } from "solid-js/web";
import SkipLink from "~/components/SkipLink";
import RouteErrorFallback from "~/components/RouteErrorFallback";
import "./app.css";

function AppShell(props: { children: JSX.Element }) {
  // #region agent log
  const _payload = JSON.stringify({sessionId:'1e53c5',hypothesisId:'C,E',location:'app.tsx:AppShell',message:'AppShell render',data:{isServer,ctxId:sharedConfig.context?.id ?? null,hydrating:!!sharedConfig.context,navType:isServer?null:(performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined)?.type ?? null,activationStart:isServer?null:((performance.getEntriesByType('navigation')[0] as unknown as {activationStart?:number})?.activationStart ?? null),prerendering:isServer?null:((document as unknown as {prerendering?:boolean}).prerendering ?? null),href:isServer?null:location.pathname},timestamp:Date.now()});
  if (isServer) { try { appendFileSync("/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log", _payload + "\n"); } catch { /* ignore */ } } else { fetch('/api/__debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:_payload}).catch(()=>{}); }
  // #endregion
  return (
    <>
      <SkipLink />
      <ErrorBoundary
        fallback={(error, reset) => {
          // #region agent log
          const _err = JSON.stringify({sessionId:'1e53c5',hypothesisId:'ALL',location:'app.tsx:ErrorBoundary',message:'root error boundary caught',data:{isServer,msg:String((error as Error)?.message ?? error).slice(0,300)},timestamp:Date.now()});
          if (isServer) { try { appendFileSync("/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log", _err + "\n"); } catch { /* ignore */ } } else { fetch('/api/__debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:_err}).catch(()=>{}); }
          // #endregion
          return <RouteErrorFallback error={error} reset={reset} variant="standalone" />;
        }}
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
