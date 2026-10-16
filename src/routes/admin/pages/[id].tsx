import { A, revalidate, useParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import EmptyState from "~/components/EmptyState";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";
import {
  getApiErrorMessage,
  getApiErrorUserMessage,
  getApiValidationErrors,
  isApiError,
} from "~/lib/api/errors";
import { getPublicSite } from "~/lib/api/queries/public";

export default function AdminPageEdit() {
  const params = useParams();
  const [title, setTitle] = createSignal("");
  const [slug, setSlug] = createSignal("");
  const [body, setBody] = createSignal("");
  const [seoTitle, setSeoTitle] = createSignal("");
  const [seoDescription, setSeoDescription] = createSignal("");
  const [dirty, setDirty] = createSignal(false);
  const [status, setStatus] = createSignal("");
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [formError, setFormError] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});

  function clearFormErrors() {
    setFormError(null);
    setFieldErrors({});
  }

  function applyMutationError(error: unknown) {
    clearFormErrors();
    if (isApiError(error) && error.status === 403) {
      const copy = getApiErrorUserMessage(error);
      setFormError(`${copy.title}. ${copy.description}`);
      return;
    }
    const validation = getApiValidationErrors(error);
    if (validation.length > 0) {
      const map: Record<string, string> = {};
      for (const item of validation) {
        map[item.field] = item.message;
      }
      setFieldErrors(map);
      setFormError(getApiErrorMessage(error) || "Check the fields below.");
      return;
    }
    setFormError(getApiErrorMessage(error));
  }

  onMount(async () => {
    if (params.id === "new") return;
    try {
      const page = await adminPagesApi.get(params.id);
      setTitle(page.title);
      setSlug(page.slug);
      setBody(page.body);
      setSeoTitle(page.seoTitle ?? "");
      setSeoDescription(page.seoDescription ?? "");
      setStatus(page.publishStatus);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        setNotFound(true);
        return;
      }
      setLoadError(getApiErrorMessage(error));
    }
  });

  onMount(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty()) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  });

  async function save() {
    clearFormErrors();
    try {
      if (params.id === "new") {
        await adminPagesApi.create({
          slug: slug(),
          title: title(),
          body: body(),
          seoTitle: seoTitle() || null,
          seoDescription: seoDescription() || null,
        });
      } else {
        await adminPagesApi.update(params.id, {
          slug: slug(),
          title: title(),
          body: body(),
          seoTitle: seoTitle() || null,
          seoDescription: seoDescription() || null,
        });
      }
      setDirty(false);
      revalidate(getPublicSite.key);
    } catch (error) {
      applyMutationError(error);
    }
  }

  async function publish() {
    clearFormErrors();
    try {
      await adminPagesApi.publish(params.id);
      revalidate(getPublicSite.key);
    } catch (error) {
      applyMutationError(error);
    }
  }

  return (
    <Show
      when={!notFound()}
      fallback={
        <EmptyState
          variant="list"
          title="Page not found"
          description="This page may have been deleted or the link is wrong."
        >
          <A href="/admin/pages" class="siam-btn-primary no-underline">
            Back to pages
          </A>
        </EmptyState>
      }
    >
      <div>
        <h1 class="text-2xl font-bold text-ink">Edit page</h1>
        <Show when={loadError()}>
          <p class="siam-alert-error mt-4" role="alert">{loadError()}</p>
        </Show>
        <Show when={status()}>
          <p class="mt-1 text-sm text-ink-muted">Status: {status()}</p>
        </Show>
        <Show when={formError()}>
          <p class="siam-alert-error mt-4" role="alert">{formError()}</p>
        </Show>
        <div class="mt-6 max-w-2xl space-y-4">
          <div>
            <input
              class="siam-input"
              placeholder="Title"
              value={title()}
              onInput={(e) => {
                setTitle(e.currentTarget.value);
                setDirty(true);
              }}
              aria-invalid={fieldErrors().title ? true : undefined}
            />
            <Show when={fieldErrors().title}>
              <p class="mt-1 text-sm text-error">{fieldErrors().title}</p>
            </Show>
          </div>
          <div>
            <input
              class="siam-input"
              placeholder="slug"
              value={slug()}
              onInput={(e) => {
                setSlug(e.currentTarget.value);
                setDirty(true);
              }}
              aria-invalid={fieldErrors().slug ? true : undefined}
            />
            <Show when={fieldErrors().slug}>
              <p class="mt-1 text-sm text-error">{fieldErrors().slug}</p>
            </Show>
          </div>
          <textarea
            class="siam-textarea"
            rows={8}
            value={body()}
            onInput={(e) => {
              setBody(e.currentTarget.value);
              setDirty(true);
            }}
          />
          <input
            class="siam-input"
            placeholder="SEO title (optional)"
            value={seoTitle()}
            onInput={(e) => {
              setSeoTitle(e.currentTarget.value);
              setDirty(true);
            }}
          />
          <textarea
            class="siam-textarea"
            rows={2}
            placeholder="SEO description (optional)"
            value={seoDescription()}
            onInput={(e) => {
              setSeoDescription(e.currentTarget.value);
              setDirty(true);
            }}
          />
          <div class="flex flex-wrap gap-2">
            <button type="button" class="siam-btn-primary" onClick={save}>
              Save
            </button>
            <Show when={params.id !== "new"}>
              <button type="button" class="siam-btn-secondary" onClick={publish}>
                Publish
              </button>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
