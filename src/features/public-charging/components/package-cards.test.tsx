import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";

import { PackageCards } from "./package-cards";

describe("PackageCards", () => {
  it("shows backend package price and does not render editable amount input", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <PackageCards
        packages={[
          {
            publicPackageId: "PKG_500",
            name: "Quick Charge",
            description: "Small top-up",
            priceMinor: "500",
            currency: "TZS",
            durationSeconds: 1200,
            displayOrder: 1,
          },
        ]}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("TZS 500")).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /quick charge/i }));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ priceMinor: "500" }),
    );
  });
});
