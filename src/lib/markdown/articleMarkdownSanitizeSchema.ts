import { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";

/** KaTeX / MathML tags emitted by `rehype-katex` (allowlist extension). */
const KATEX_TAG_NAMES = [
  "math",
  "semantics",
  "mrow",
  "mi",
  "mn",
  "mo",
  "ms",
  "mtext",
  "annotation",
  "menclose",
  "mfrac",
  "msqrt",
  "mroot",
  "msub",
  "msup",
  "msubsup",
  "munder",
  "mover",
  "munderover",
  "mtable",
  "mtr",
  "mtd",
  "mlabeledtr",
  "maligngroup",
  "malignmark",
  "mpadded",
  "mphantom",
  "mstyle",
  "mspace",
] as const;

function mergeAttributeList(
  base: readonly string[] | undefined,
  extra: readonly string[],
): string[] {
  return [...new Set([...(base ?? []), ...extra])];
}

/**
 * Sanitize schema for article HTML after `rehype-katex`.
 * Extends `rehype-sanitize` defaults with KaTeX/MathML tags and classes.
 */
export const articleMarkdownSanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: mergeAttributeList(defaultSchema.tagNames, [...KATEX_TAG_NAMES]),
  attributes: {
    ...defaultSchema.attributes,
    "*": mergeAttributeList(defaultSchema.attributes?.["*"], [
      "className",
      "aria-hidden",
    ]),
    span: mergeAttributeList(defaultSchema.attributes?.span, [
      "className",
      "style",
      "aria-hidden",
    ]),
    div: mergeAttributeList(defaultSchema.attributes?.div, ["className"]),
    code: mergeAttributeList(defaultSchema.attributes?.code, ["className"]),
    pre: mergeAttributeList(defaultSchema.attributes?.pre, ["className"]),
    a: mergeAttributeList(defaultSchema.attributes?.a, [
      "href",
      "title",
      "rel",
      "target",
    ]),
    img: mergeAttributeList(defaultSchema.attributes?.img, [
      "src",
      "alt",
      "title",
      "width",
      "height",
    ]),
    math: ["xmlns", "display"],
    semantics: ["encoding"],
    annotation: ["encoding"],
    td: mergeAttributeList(defaultSchema.attributes?.td, ["align"]),
    th: mergeAttributeList(defaultSchema.attributes?.th, ["align"]),
  },
};
