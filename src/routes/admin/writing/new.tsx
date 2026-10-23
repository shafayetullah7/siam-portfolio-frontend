import { Title } from "@solidjs/meta";
import WritingEditor from "~/components/admin/writing/WritingEditor";

export default function AdminWritingNew() {
  return (
    <>
      <Title>New article — SIAM Admin</Title>
      <WritingEditor />
    </>
  );
}
