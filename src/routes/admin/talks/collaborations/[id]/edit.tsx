import { useParams } from "@solidjs/router";
import CollaborationEditor from "~/components/admin/talks/CollaborationEditor";

export default function AdminCollaborationEdit() {
  const params = useParams();
  return <CollaborationEditor entryId={params.id} />;
}
