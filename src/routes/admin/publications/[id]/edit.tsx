import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import PublicationEditorForm from "~/components/admin/publications/PublicationEditorForm";

export default function AdminPublicationEdit() {
  const params = useParams();
  const publicationId = () => params.id ?? "";

  return (
    <>
      <Title>Edit publication — SIAM Admin</Title>
      <PublicationEditorForm publicationId={publicationId()} />
    </>
  );
}
