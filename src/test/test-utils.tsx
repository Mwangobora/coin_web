import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { AppProviders } from "@/providers/app-providers";

function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AppProviders, ...options });
}

export * from "@testing-library/react";
export { renderWithProviders as render };
