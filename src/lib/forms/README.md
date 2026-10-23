# Forms (Zod + actions)

**Zod is for form/input validation only** — not for parsing API JSON responses.

## Default mutation pattern (F7)

Admin writes use Router **`action`** + **`useSubmission`** + **`method="post"`** (client-executed actions so `adminClient` CSRF cookies work).

```tsx
import { action, useSubmission } from "@solidjs/router";
import { saveSiteSettingsAction } from "~/lib/forms/actions/admin-site.actions";

const submission = useSubmission(saveSiteSettingsAction);

<form action={saveSiteSettingsAction} method="post">
  <button type="submit" disabled={submission.pending}>Save</button>
</form>
```

Actions return [`FormActionResult`](./types.ts): `{ ok: true }` or `{ ok: false, formMessage, fieldErrors? }`. CMS errors use [`mapAdminMutationError`](./mapAdminMutationError.ts); auth login uses `getAuthFormErrorMessage`.

**Server `"use server"` actions** are not used for admin mutations yet — they need forwarded `Cookie` / XSRF ([api-convention §11](../../docs/api-convention.md)).

## Layout

| Path | Role |
|------|------|
| `schemas/*.schema.ts` | Zod 4 input validation |
| `actions/*.actions.ts` | `action()` handlers calling endpoints |
| `mapZodErrors.ts` | Zod → field map |
| `parseFormData.ts` | `FormData` → values + `parseWithSchema` |
| `useUnsavedChanges.ts` | `beforeunload` when dirty |

## Public contact (P16 / MSG4)

Route: [`/contact`](../../routes/(public)/contact.tsx). Form UI: [`ContactForm`](../../components/contact/ContactForm.tsx).

```ts
const parsed = contactInquirySchema.safeParse(values);
if (!parsed.success) {
  setFieldErrors(mapZodErrors(parsed.error));
  return;
}
await contactPublicApi.submit(parsed.data);
```

Schema: [`contact-inquiry.schema.ts`](./schemas/contact-inquiry.schema.ts). Config: `getPublicContactConfig()` in [`contact.queries.ts`](../api/queries/public/contact.queries.ts).

Spec: [api-convention.md](../../docs/api-convention.md) §10.
