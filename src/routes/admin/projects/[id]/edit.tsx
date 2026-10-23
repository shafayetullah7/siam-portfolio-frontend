import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import ProjectEditorForm from "~/components/admin/projects/ProjectEditorForm";

export default function AdminProjectEdit() {
  const params = useParams();
  const projectId = () => params.id ?? "";

  return (
    <>
      <Title>Edit project — SIAM Admin</Title>
      <ProjectEditorForm projectId={projectId()} />
    </>
  );
}
