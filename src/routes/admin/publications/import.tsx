import { Title } from "@solidjs/meta";
import PublicationImportWizard from "~/components/admin/publications/PublicationImportWizard";

export default function AdminPublicationImport() {
  return (
    <>
      <Title>Import publication — SIAM Admin</Title>
      <PublicationImportWizard />
    </>
  );
}
