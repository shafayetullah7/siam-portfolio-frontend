import PublicationCreateWizard from "./create/PublicationCreateWizard";

export type PublicationEditorFormProps = {
  /** Omit or `"new"` for create; publication UUID for edit. */
  publicationId?: string;
};

/** @deprecated Use PublicationCreateWizard — kept for route imports. */
export default function PublicationEditorForm(props: PublicationEditorFormProps) {
  return <PublicationCreateWizard publicationId={props.publicationId} />;
}
