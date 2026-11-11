import { Index, Show } from "solid-js";
import type { HomeSectionConfig } from "~/lib/api/types/home.types";
import {
  moduleEditorHref,
  sectionAdminLabel,
} from "~/lib/home/admin-home-sections";

export type HomeSectionsEditorProps = {
  sections: HomeSectionConfig[];
  onChange: (sections: HomeSectionConfig[]) => void;
  onDirty: () => void;
  fieldError?: string;
};

export default function HomeSectionsEditor(props: HomeSectionsEditorProps) {
  function setSections(next: HomeSectionConfig[]) {
    props.onChange(next);
    props.onDirty();
  }

  function toggleVisible(index: number, visible: boolean) {
    const row = props.sections[index];
    if (row.id === "hero") return;
    const next = props.sections.map((s, i) =>
      i === index ? { ...s, visible } : s,
    );
    setSections(next);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= props.sections.length) return;
    const next = [...props.sections];
    const [removed] = next.splice(index, 1);
    next.splice(target, 0, removed);
    setSections(next);
  }

  return (
    <div class="space-y-2">
      <p class="text-sm text-ink-muted">
        Order and visibility for landing page sections. Hero is always shown.
      </p>
      <Show when={props.fieldError}>
        <p class="text-sm text-error">{props.fieldError}</p>
      </Show>
      <ul class="space-y-2">
        <Index each={props.sections}>
          {(section, index) => {
            const deepLink = () => moduleEditorHref(section().id);
            const isHero = () => section().id === "hero";
            return (
              <li class="siam-card flex flex-wrap items-center gap-3 p-3">
                <span class="min-w-[8rem] flex-1 text-sm font-medium text-ink">
                  {sectionAdminLabel(section().id)}
                </span>
                <Show when={deepLink()}>
                  {(href) => (
                    <a
                      href={href()}
                      class="text-xs text-primary no-underline hover:underline"
                    >
                      Manage content
                    </a>
                  )}
                </Show>
                <label class="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={section().visible}
                    disabled={isHero()}
                    onChange={(e) => toggleVisible(index, e.currentTarget.checked)}
                  />
                  <span>{isHero() ? "Always on" : "Visible"}</span>
                </label>
                <div class="flex gap-1">
                  <button
                    type="button"
                    class="siam-btn-secondary px-2 py-1 text-xs"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    class="siam-btn-secondary px-2 py-1 text-xs"
                    disabled={index === props.sections.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    Down
                  </button>
                </div>
              </li>
            );
          }}
        </Index>
      </ul>
    </div>
  );
}
