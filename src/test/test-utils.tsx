import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { Providers } from "@/app/providers";

function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from "@testing-library/react";
export { renderWithProviders as render };
