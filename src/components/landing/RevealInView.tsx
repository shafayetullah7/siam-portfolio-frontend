import { createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

export type RevealInViewProps = {
  children: JSX.Element;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function RevealInView(props: RevealInViewProps) {
  const [visible, setVisible] = createSignal(false);
  const [motionEnabled, setMotionEnabled] = createSignal(false);
  let rootRef: HTMLDivElement | undefined;

  onMount(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    setMotionEnabled(true);
    const node = rootRef;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div
      ref={rootRef}
      classList={{
        "siam-reveal": motionEnabled(),
        "is-visible": visible(),
      }}
    >
      {props.children}
    </div>
  );
}
