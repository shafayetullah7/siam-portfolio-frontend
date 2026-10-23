import { Title } from "@solidjs/meta";
import ProjectEditorForm from "~/components/admin/projects/ProjectEditorForm";

export default function AdminProjectNew() {
  return (
    <>
      <Title>New project — SIAM Admin</Title>
      <ProjectEditorForm />
    </>
  );
}
