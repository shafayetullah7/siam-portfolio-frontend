import { Title } from "@solidjs/meta";
import PublicationEditorForm from "~/components/admin/publications/PublicationEditorForm";

export default function AdminPublicationNew() {
  return (
    <>
      <Title>New publication — SIAM Admin</Title>
      <PublicationEditorForm />
    </>
  );
}
