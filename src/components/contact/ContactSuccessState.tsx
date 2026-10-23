export type ContactSuccessStateProps = {
  message: string;
};

export default function ContactSuccessState(props: ContactSuccessStateProps) {
  return (
    <div
      class="rounded-lg border border-border bg-surface-muted px-4 py-6"
      role="status"
      aria-live="polite"
    >
      <p class="text-ink font-medium">Message sent</p>
      <p class="mt-2 text-ink-muted">{props.message}</p>
    </div>
  );
}
