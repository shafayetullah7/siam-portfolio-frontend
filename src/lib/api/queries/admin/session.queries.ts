// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore node builtin, server side only
import { appendFileSync } from "node:fs";
import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { fetchAdminSession } from "../../server/adminSession.server";

/** Layout session — profile or null; never throws (SSR + hydrate). */
export const getAdminSession = query(async () => {
  "use server";
  const event = getRequestEvent();
  const cookie = event?.request.headers.get("cookie") ?? null;
  const result = await fetchAdminSession(cookie);
  // #region agent log
  try { appendFileSync("/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log", JSON.stringify({sessionId:'1e53c5',hypothesisId:'A',location:'session.queries.ts:getAdminSession',message:'server session fetched',data:{hasEvent:!!event,hasCookie:!!cookie,hasProfile:!!result,path:event?new URL(event.request.url).pathname:null},timestamp:Date.now()}) + "\n"); } catch { /* ignore */ }
  // #endregion
  return result;
}, "admin-session");
