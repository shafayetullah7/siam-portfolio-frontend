import { copyToClipboard } from "~/lib/copy-to-clipboard";

const WRAPPER_CLASS = "article-code-block";
const ENHANCED_ATTR = "data-siam-code-enhanced";

export function enhanceArticleMarkdown(root: HTMLElement | null | undefined): void {
  if (!root) return;

  const pres = root.querySelectorAll("pre");
  for (const pre of pres) {
    if (!(pre instanceof HTMLPreElement)) continue;
    if (pre.hasAttribute(ENHANCED_ATTR)) continue;
    if (pre.closest(`.${WRAPPER_CLASS}`)) continue;

    const code = pre.querySelector("code");
    const text = code?.textContent ?? pre.textContent ?? "";
    if (!text.trim()) continue;

    const wrapper = document.createElement("div");
    wrapper.className = WRAPPER_CLASS;

    const toolbar = document.createElement("div");
    toolbar.className = "article-code-block__toolbar";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "article-code-block__copy siam-btn-secondary text-xs";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      const ok = await copyToClipboard(text);
      if (ok) {
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 2000);
      }
    });

    toolbar.appendChild(button);
    pre.setAttribute(ENHANCED_ATTR, "true");
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(pre);
  }
}
