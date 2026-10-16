import { type JSX, type ResourceReturn, Show } from "solid-js";
import EmptyState from "./EmptyState";
import HttpErrorNotice from "./HttpErrorNotice";
import PageLoading from "./PageLoading";

export default function ResourceRequest<T>(props: {
  resource: ResourceReturn<T>;
  children: (data: T) => JSX.Element;
  emptyWhen?: (data: T) => boolean;
  emptyFallback?: JSX.Element;
}) {
  const [data, { error, loading, refetch }] = props.resource;

  return (
    <Show when={!loading()} fallback={<PageLoading />}>
      <Show
        when={!error()}
        fallback={
          <HttpErrorNotice error={error()!} onRetry={() => refetch()} />
        }
      >
        <Show when={data()} keyed>
          {(item) => (
            <Show
              when={!props.emptyWhen?.(item)}
              fallback={
                props.emptyFallback ?? (
                  <EmptyState
                    variant="list"
                    title="Nothing here yet"
                    description="There is no content to show."
                  />
                )
              }
            >
              {props.children(item)}
            </Show>
          )}
        </Show>
      </Show>
    </Show>
  );
}
