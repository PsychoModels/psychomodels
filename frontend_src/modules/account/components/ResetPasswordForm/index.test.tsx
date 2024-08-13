import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { server } from "../../../../setup-vitest.ts";
import { delay, http, HttpResponse } from "msw";
import "@testing-library/jest-dom";

import { ResetPasswordForm } from "./index.tsx";
import { useParams } from "@tanstack/react-router";

// Mock window.scrollTo globally
// @ts-ignore
window.scrollTo = vi.fn();

// Mock useParams to return a specific key
vi.mock("@tanstack/react-router", () => ({
  useParams: vi.fn(),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    // Mock useParams to return a real reset key value as if passed from the router
    vi.mocked(useParams).mockReturnValue({ key: "real-reset-key" });
  });
  it("renders the form correctly", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/password/reset", () => {
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

    renderWithQueryClient(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("New password")).toBeInTheDocument();
      expect(screen.getByLabelText("Repeat new password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Reset password/i }),
      ).toBeInTheDocument();
    });
  });

  it("displays a spinner during loading state", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/password/reset", async () => {
        await delay("infinite");
      }),
    );
    renderWithQueryClient(<ResetPasswordForm />);

    expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner is rendered
  });

  it("displays an error if the reset link is invalid", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/password/reset", () => {
        return HttpResponse.json(
          {
            errors: [
              {
                message: "The password reset token was invalid.",
                code: "invalid_password_reset",
                param: "key",
              },
            ],
          },
          {
            status: 400,
          },
        );
      }),
    );

    renderWithQueryClient(<ResetPasswordForm />);

    await waitFor(() => {
      expect(
        screen.getByText(/The password reset link was invalid/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please request a new password reset/i),
      ).toBeInTheDocument();
    });
  });

  it("displays success message on successful password reset", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/password/reset", () => {
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
      http.post("/_allauth/browser/v1/auth/password/reset", () => {
        return new HttpResponse(null, {
          status: 200,
        });
      }),
    );

    renderWithQueryClient(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("New password")).toBeInTheDocument();
      expect(screen.getByLabelText("Repeat new password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Reset password/i }),
      ).toBeInTheDocument();
    });

    fireEvent.input(screen.getByLabelText("New password"), {
      target: { value: "newvalidpassword" },
    });
    fireEvent.input(screen.getByLabelText("Repeat new password"), {
      target: { value: "newvalidpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Your password has been successfully changed."),
      ).toBeInTheDocument();
    });

    // Check if window.scrollTo was called
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("displays validation error when passwords do not match", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/password/reset", () => {
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

    renderWithQueryClient(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("New password")).toBeInTheDocument();
      expect(screen.getByLabelText("Repeat new password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Reset password/i }),
      ).toBeInTheDocument();
    });

    fireEvent.input(screen.getByLabelText("New password"), {
      target: { value: "newvalidpassword" },
    });
    fireEvent.input(screen.getByLabelText("Repeat new password"), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset password/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("displays an error message on general failure during password reset", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/password/reset", () => {
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
      http.post("/_allauth/browser/v1/auth/password/reset", () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    renderWithQueryClient(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("New password")).toBeInTheDocument();
      expect(screen.getByLabelText("Repeat new password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Reset password/i }),
      ).toBeInTheDocument();
    });

    fireEvent.input(screen.getByLabelText("New password"), {
      target: { value: "newvalidpassword" },
    });
    fireEvent.input(screen.getByLabelText("Repeat new password"), {
      target: { value: "newvalidpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset password/i }));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/A general error occurred/i)).toBeInTheDocument();
    });
  });
});
