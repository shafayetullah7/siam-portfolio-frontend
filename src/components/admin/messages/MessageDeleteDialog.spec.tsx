import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import MessageDeleteDialog from "./MessageDeleteDialog";

vi.mock("~/components/admin/AdminDialog", () => ({
  default: (props: {
    open: boolean;
    title: string;
    children: unknown;
    footer: unknown;
    onClose: () => void;
  }) =>
    props.open ? (
      <div data-testid="dialog">
        <h2>{props.title}</h2>
        {props.children}
        {props.footer}
      </div>
    ) : null,
}));

describe("MessageDeleteDialog", () => {
  it("calls onConfirm when Delete is clicked", () => {
    const onConfirm = vi.fn();
    render(() => (
      <MessageDeleteDialog
        open={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    ));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(() => (
      <MessageDeleteDialog
        open={true}
        onClose={onClose}
        onConfirm={vi.fn()}
      />
    ));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
