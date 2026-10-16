import { createSignal, onMount, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";

export default function AdminPageEdit() {
  const params = useParams();
  const [title, setTitle] = createSignal("");
  const [slug, setSlug] = createSignal("");
  const [body, setBody] = createSignal("");
  const [seoTitle, setSeoTitle] = createSignal("");
  const [seoDescription, setSeoDescription] = createSignal("");
  const [dirty, setDirty] = createSignal(false);
  const [status, setStatus] = createSignal("");

  onMount(async () => {
    if (params.id === "new") return;
    const page = await adminPagesApi.get(params.id);
    setTitle(page.title);
    setSlug(page.slug);
    setBody(page.body);
    setSeoTitle(page.seoTitle ?? "");
    setSeoDescription(page.seoDescription ?? "");
    setStatus(page.publishStatus);
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
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-ink">Edit page</h1>
      <Show when={status()}>
        <p class="mt-1 text-sm text-ink-muted">Status: {status()}</p>
      </Show>
      <div class="mt-6 max-w-2xl space-y-4">
        <input
          class="siam-input"
          placeholder="Title"
          value={title()}
          onInput={(e) => {
            setTitle(e.currentTarget.value);
            setDirty(true);
          }}
        />
        <input
          class="siam-input"
          placeholder="slug"
          value={slug()}
          onInput={(e) => {
            setSlug(e.currentTarget.value);
            setDirty(true);
          }}
        />
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
            <button
              type="button"
              class="siam-btn-secondary"
              onClick={() => adminPagesApi.publish(params.id)}
            >
              Publish
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}
