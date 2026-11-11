import { useParams } from "@solidjs/router";
import TalkEditor from "~/components/admin/talks/TalkEditor";

export default function AdminTalkEdit() {
  const params = useParams();
  return <TalkEditor talkId={params.id} />;
}
