import { A, useParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import {
  publishPageAction,
  savePageAction,
} from "~/lib/forms/actions/admin-pages.actions";
import type { FormActionResult } from "~/lib/forms/types";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";

function resultMessage(result: FormActionResult | undefined): string | null {
  if (result && !result.ok) return result.formMessage;
  return null;
}

function resultFieldErrors(
  result: FormActionResult | undefined,
): Record<string, string> {
  if (result && !result.ok && result.fieldErrors) return result.fieldErrors;
  return {};
}

export default function AdminPageEdit() {
  const params = useParams();
  const pageId = () => params.id ?? "new";
  const saveSubmission = useSubmission(savePageAction);
  const publishSubmission = useSubmission(publishPageAction);

  const [title, setTitle] = createSignal("");
  const [slug, setSlug] = createSignal("");
  const [body, setBody] = createSignal("");
  const [seoTitle, setSeoTitle] = createSignal("");
  const [seoDescription, setSeoDescription] = createSignal("");
  const [dirty, setDirty] = createSignal(false);
  const [status, setStatus] = createSignal("");
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  useUnsavedChanges(dirty);

  const activeResult = () => {
    const publish = publishSubmission.result as FormActionResult | undefined;
    if (publish && !publish.ok) return publish;
    return saveSubmission.result as FormActionResult | undefined;
  };

  const fieldErrors = () => resultFieldErrors(activeResult());
  const formMessage = () => {
    const fromResult = resultMessage(activeResult());
    if (fromResult) return fromResult;
    if (saveSubmission.error) return saveSubmission.error.message;
    if (publishSubmission.error) return publishSubmission.error.message;
    return null;
  };

  onMount(async () => {
    if (pageId() === "new") return;
    try {
      const page = await adminPagesApi.get(pageId());
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

  createEffect(() => {
    const save = saveSubmission.result as FormActionResult | undefined;
    const publish = publishSubmission.result as FormActionResult | undefined;
    if (save?.ok || publish?.ok) {
      setDirty(false);
    }
    if (publish?.ok) {
      setStatus("published");
    }
  });

  function markDirty() {
    setDirty(true);
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
          <FormErrorAlert message={loadError()} />
        </Show>
        <Show when={status()}>
          <p class="mt-1 text-sm text-ink-muted">Status: {status()}</p>
        </Show>
        <FormErrorAlert message={formMessage()} />
        <form
          class="mt-6 max-w-2xl space-y-4"
          action={savePageAction.with(pageId())}
          method="post"
          onInput={markDirty}
        >
          <FormField label="Title" name="title" error={fieldErrors().title}>
            <FormTextInput
              name="title"
              placeholder="Title"
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              error={fieldErrors().title}
            />
          </FormField>
          <FormField label="Slug" name="slug" error={fieldErrors().slug}>
            <FormTextInput
              name="slug"
              placeholder="slug"
              value={slug()}
              onInput={(e) => setSlug(e.currentTarget.value)}
              error={fieldErrors().slug}
            />
          </FormField>
          <FormField label="Body" name="body" error={fieldErrors().body}>
            <FormTextarea
              name="body"
              rows={8}
              value={body()}
              onInput={(e) => setBody(e.currentTarget.value)}
              error={fieldErrors().body}
            />
          </FormField>
          <FormField label="SEO title (optional)" name="seoTitle">
            <FormTextInput
              name="seoTitle"
              value={seoTitle()}
              onInput={(e) => setSeoTitle(e.currentTarget.value)}
            />
          </FormField>
          <FormField label="SEO description (optional)" name="seoDescription">
            <FormTextarea
              name="seoDescription"
              rows={2}
              value={seoDescription()}
              onInput={(e) => setSeoDescription(e.currentTarget.value)}
            />
          </FormField>
          <div class="flex flex-wrap gap-2">
            <button
              type="submit"
              class="siam-btn-primary"
              disabled={saveSubmission.pending || publishSubmission.pending}
            >
              {saveSubmission.pending ? "Saving…" : "Save"}
            </button>
            <Show when={pageId() !== "new"}>
              <button
                type="submit"
                class="siam-btn-secondary"
                formaction={publishPageAction.with(pageId())}
                disabled={saveSubmission.pending || publishSubmission.pending}
              >
                {publishSubmission.pending ? "Publishing…" : "Publish"}
              </button>
            </Show>
          </div>
        </form>
      </div>
    </Show>
  );
}
