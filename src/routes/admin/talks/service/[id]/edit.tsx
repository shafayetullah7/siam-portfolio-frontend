import { useParams } from "@solidjs/router";
import AcademicServiceEditor from "~/components/admin/talks/AcademicServiceEditor";

export default function AdminAcademicServiceEdit() {
  const params = useParams();
  return <AcademicServiceEditor entryId={params.id} />;
}
