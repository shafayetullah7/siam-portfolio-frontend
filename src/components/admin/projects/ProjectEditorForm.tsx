import ProjectCreateWizard from "./create/ProjectCreateWizard";

export type ProjectEditorFormProps = {
  projectId?: string;
};

export default function ProjectEditorForm(props: ProjectEditorFormProps) {
  return <ProjectCreateWizard projectId={props.projectId} />;
}
