import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  emptyToNull,
  formDataToObject,
  parseWithSchema,
} from "./parseFormData";

describe("parseFormData", () => {
  it("formDataToObject collects string fields", () => {
    const fd = new FormData();
    fd.set("a", "1");
    fd.set("b", "two");
    expect(formDataToObject(fd)).toEqual({ a: "1", b: "two" });
  });

  it("emptyToNull", () => {
    expect(emptyToNull("")).toBe(null);
    expect(emptyToNull("  ")).toBe(null);
    expect(emptyToNull("x")).toBe("x");
  });

  it("parseWithSchema returns field errors on fail", () => {
    const schema = z.object({ name: z.string().min(1) });
    const fd = new FormData();
    fd.set("name", "");
    const out = parseWithSchema(fd, () => ({ name: fd.get("name") }), schema);
    expect(out.success).toBe(false);
    if (!out.success) {
      expect(out.result.ok).toBe(false);
      if (!out.result.ok) {
        expect(out.result.fieldErrors?.name).toBeTruthy();
      }
    }
  });
});
