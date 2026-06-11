import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi, afterEach } from "vitest";

vi.mock(
  "@marsidev/react-turnstile",
  () => import("../../../../test-utils/turnstileMock.tsx"),
);

import { TurnstileWidget } from "./TurnstileWidget.tsx";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TurnstileWidget", () => {
  it("renders the widget and forwards the token when a site key is set", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");
    const onTokenChange = vi.fn();

    render(<TurnstileWidget onTokenChange={onTokenChange} />);

    expect(screen.getByTestId("turnstile-widget")).toBeInTheDocument();
    await waitFor(() => {
      expect(onTokenChange).toHaveBeenCalledWith("test-turnstile-token");
    });
  });

  it("renders nothing and emits a placeholder token when no site key is set", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "");
    const onTokenChange = vi.fn();

    render(<TurnstileWidget onTokenChange={onTokenChange} />);

    expect(screen.queryByTestId("turnstile-widget")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(onTokenChange).toHaveBeenCalledWith("turnstile-disabled");
    });
  });
});
