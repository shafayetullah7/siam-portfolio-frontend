import type { APIEvent } from "@solidjs/start/server";
import { apiBaseUrl } from "~/lib/api/config";

export async function GET(_event: APIEvent) {
  const url = `${apiBaseUrl()}/public/writing/feed.xml`;
  const res = await fetch(url, {
    headers: { Accept: "application/rss+xml" },
  });
  const xml = await res.text();
  const headers: Record<string, string> = {
    "Content-Type": "application/rss+xml; charset=utf-8",
  };
  const cacheControl = res.headers.get("Cache-Control");
  if (cacheControl) {
    headers["Cache-Control"] = cacheControl;
  }
  const etag = res.headers.get("ETag");
  if (etag) {
    headers.ETag = etag;
  }
  return new Response(xml, { status: res.status, headers });
}
