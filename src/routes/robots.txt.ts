import type { APIEvent } from "@solidjs/start/server";

export function GET(_event: APIEvent) {
  return new Response("User-agent: *\nAllow: /\n", {
    headers: { "Content-Type": "text/plain" },
  });
}
