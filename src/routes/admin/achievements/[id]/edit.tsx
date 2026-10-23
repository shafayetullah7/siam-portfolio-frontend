import { useNavigate, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { onMount } from "solid-js";
import TimelineEntryEditor from "~/components/admin/timeline/TimelineEntryEditor";

export default function AdminAchievementsEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const entryId = () => params.id ?? "";

  onMount(() => {
    if (entryId() === "new") {
      navigate("/admin/achievements/new", { replace: true });
    }
  });

  return (
    <>
      <Title>Edit timeline entry — SIAM Admin</Title>
      <TimelineEntryEditor entryId={entryId()} />
    </>
  );
}
