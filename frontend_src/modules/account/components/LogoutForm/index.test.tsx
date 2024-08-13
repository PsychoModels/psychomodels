import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";
import "@testing-library/jest-dom";
import { LogoutForm } from "./index.tsx";

vi.mock("@tanstack/react-router", () => ({
  useRouter: vi.fn(),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

describe("LogoutForm", () => {
  it("renders the logout form correctly", () => {
    renderWithQueryClient(<LogoutForm />);

    expect(
      screen.getByText("Are you sure you want to logout?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  it("shows success message on successful logout", async () => {
    server.use(
      http.delete("/_allauth/browser/v1/auth/session", () => {
        return new HttpResponse(null, {
          status: 200,
        });
      }),
    );

    renderWithQueryClient(<LogoutForm />);

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    await waitFor(() => {
      expect(
        screen.getByText("You are successfully logged out."),
      ).toBeInTheDocument();
      expect(screen.getByText(/Login again/i)).toBeInTheDocument();
    });
  });

  it("displays error message if logout fails", async () => {
    server.use(
      http.delete("/_allauth/browser/v1/auth/session", () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    renderWithQueryClient(<LogoutForm />);

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/A general error occurred. Please try again./i),
      ).toBeInTheDocument();
    });
  });

  it("shows success message even if user is already logged out (handled by onError)", async () => {
    server.use(
      http.delete("/_allauth/browser/v1/auth/session", () => {
        return HttpResponse.json(
          { meta: { is_authenticated: false } },
          {
            status: 401,
          },
        );
      }),
    );

    renderWithQueryClient(<LogoutForm />);

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    await waitFor(() => {
      expect(
        screen.getByText("You are successfully logged out."),
      ).toBeInTheDocument();
    });
  });
});
