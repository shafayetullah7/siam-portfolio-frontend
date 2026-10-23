import { describe, expect, it } from "vitest";
import {
  messageListSearchParamsToApi,
  parseMessageListSearchParams,
} from "./message-list-search-params";

describe("message-list-search-params", () => {
  it("defaults to inbox folder", () => {
    const params = parseMessageListSearchParams({});
    expect(params.folder).toBe("inbox");
    expect(messageListSearchParamsToApi(params)).toEqual({ limit: 24 });
  });

  it("supports dashboard status=new without folder", () => {
    const params = parseMessageListSearchParams({ status: "new" });
    expect(messageListSearchParamsToApi(params)).toMatchObject({
      status: "new",
      limit: 24,
    });
  });

  it("maps spam folder to status spam", () => {
    const params = parseMessageListSearchParams({ folder: "spam" });
    expect(messageListSearchParamsToApi(params)).toMatchObject({
      status: "spam",
    });
  });

  it("passes date range to API params", () => {
    const params = parseMessageListSearchParams({
      from: "2026-01-01",
      to: "2026-01-31",
    });
    expect(messageListSearchParamsToApi(params)).toMatchObject({
      from: "2026-01-01",
      to: "2026-01-31",
    });
  });
});
