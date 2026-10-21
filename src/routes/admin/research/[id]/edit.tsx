import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import ResearchThemeCreateWizard from "~/components/admin/research/create/ResearchThemeCreateWizard";

export default function AdminResearchEdit() {
  const params = useParams();
  const themeId = () => params.id ?? "";

  return (
    <>
      <Title>Edit research theme — SIAM Admin</Title>
      <ResearchThemeCreateWizard themeId={themeId()} />
    </>
  );
}
