import type { JSX } from "solid-js";
import RevealInView from "./RevealInView";

export type LandingSectionRevealProps = {
  children: JSX.Element;
};

export default function LandingSectionReveal(props: LandingSectionRevealProps) {
  return <RevealInView>{props.children}</RevealInView>;
}
