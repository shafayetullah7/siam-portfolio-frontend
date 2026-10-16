import RouteErrorFallback from "./RouteErrorFallback";

/** @deprecated Use RouteErrorFallback — kept for imports from F1 */
export default function AppErrorFallback(props: {
  error: unknown;
  reset: () => void;
}) {
  return <RouteErrorFallback error={props.error} reset={props.reset} />;
}
