// #region agent log
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore node builtin, server side only
import { appendFileSync } from "node:fs";
import type { APIEvent } from "@solidjs/start/server";

const LOG = "/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log";

export async function POST(event: APIEvent) {
  const body = await event.request.text();
  try {
    appendFileSync(LOG, body.replace(/\n/g, " ") + "\n");
  } catch {
    /* log path unavailable */
  }
  await fetch("http://127.0.0.1:7837/ingest/d667b9a2-0276-45b6-bac3-5e482ca9f514", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1e53c5" },
    body,
  }).catch(() => {});
  return new Response(null, { status: 204 });
}
// #endregion
