export function formatAuthorsShortPreview(
  authors: readonly { name: string }[],
): string {
  return authors
    .map((a) => a.name.trim())
    .filter(Boolean)
    .join(", ");
}
