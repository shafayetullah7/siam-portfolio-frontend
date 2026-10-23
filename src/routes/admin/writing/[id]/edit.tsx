import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import WritingEditor from "~/components/admin/writing/WritingEditor";

export default function AdminWritingEdit() {
  const params = useParams();
  const articleId = () => params.id ?? "";

  return (
    <>
      <Title>Edit article — SIAM Admin</Title>
      <WritingEditor articleId={articleId()} />
    </>
  );
}
