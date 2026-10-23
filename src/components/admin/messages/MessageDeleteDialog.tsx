import AdminDialog from "~/components/admin/AdminDialog";
import FormErrorAlert from "~/components/forms/FormErrorAlert";

export type MessageDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  busy?: boolean;
  error?: string | null;
};

export default function MessageDeleteDialog(props: MessageDeleteDialogProps) {
  return (
    <AdminDialog
      open={props.open}
      title="Delete message permanently?"
      onClose={props.onClose}
      footer={
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="siam-btn-secondary"
            disabled={props.busy}
            onClick={() => props.onClose()}
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-error px-4 py-2 text-sm font-medium text-on-error hover:opacity-90 disabled:opacity-50"
            disabled={props.busy}
            onClick={() => props.onConfirm()}
          >
            {props.busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      }
    >
      <div class="space-y-3 p-4">
        <p class="text-sm text-ink">
          This removes the inquiry from your inbox. It cannot be undone. Export or
          copy any information you need before deleting.
        </p>
        <FormErrorAlert message={props.error} />
      </div>
    </AdminDialog>
  );
}
