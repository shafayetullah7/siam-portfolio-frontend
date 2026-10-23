import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationListFilters from "./PublicationListFilters";

describe("PublicationListFilters", () => {
  it("updates type filter in URL", () => {
    const setSearchParams = vi.fn();
    render(() => (
      <PublicationListFilters
        params={{}}
        themeOptions={[]}
        setSearchParams={setSearchParams}
      />
    ));

    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "journal" },
    });

    expect(setSearchParams).toHaveBeenCalledWith(
      expect.objectContaining({ type: "journal", page: null }),
      undefined,
    );
  });
});
