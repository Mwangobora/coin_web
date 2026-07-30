import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import HomePage, { shouldShowDemoLinks } from "./page";

test("root page renders without authentication or admin navigation", () => {
  render(<HomePage />);

  expect(screen.getAllByText("Smart Charging System").length).toBeGreaterThan(
    0,
  );
  expect(
    screen.getByText(/scan the qr code on the charging machine/i),
  ).toBeInTheDocument();
  expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/register/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
});

test("demo links are hidden in production", () => {
  expect(shouldShowDemoLinks("production")).toBe(false);
  expect(shouldShowDemoLinks("development")).toBe(true);
});
