import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { server } from "../../../../setup-vitest.ts";
import { delay, http, HttpResponse } from "msw";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { AccountStep } from "./index.tsx";

vi.mock("@tanstack/react-router", () => ({
  useRouter: vi.fn(),
  useNavigate: vi.fn(),
  useMatches: vi.fn(() => [{ id: "/account" }]),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

describe("AccountStep", () => {
  it("should render loading state correctly", () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", async () => {
        await delay("infinite");
      }),
    );
    renderWithQueryClient(<AccountStep />);

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("should render error state correctly", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", async () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );
    renderWithQueryClient(<AccountStep />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(
        screen.getByText(/An error occurred. Please try again./i),
      ).toBeInTheDocument();
    });
  });

  it("should render logged-in state correctly", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", () => {
        return HttpResponse.json(
          {
            data: {
              user: {
                id: 2,
                username: "user",
                email: "user@psychomodels.org",
              },
            },
          },
          {
            status: 200,
          },
        );
      }),
    );
    renderWithQueryClient(<AccountStep />);

    await waitFor(() => {
      expect(
        screen.getByText("You are logged in with e-mail", { exact: false }),
      ).toBeInTheDocument();
      expect(screen.getByText("user@psychomodels.org")).toBeInTheDocument();
    });
  });
});
