import { Title } from "@solidjs/meta";
import ResearchThemeCreateWizard from "~/components/admin/research/create/ResearchThemeCreateWizard";

export default function AdminResearchNew() {
  return (
    <>
      <Title>Create research theme — SIAM Admin</Title>
      <ResearchThemeCreateWizard />
    </>
  );
}
