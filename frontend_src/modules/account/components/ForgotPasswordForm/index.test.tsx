import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";
import "@testing-library/jest-dom";
import { ForgotPasswordForm } from "./index.tsx";

// Mock window.scrollTo globally
// @ts-ignore
window.scrollTo = vi.fn();

describe("ForgotPasswordForm", () => {
  it("renders the form fields correctly", () => {
    renderWithQueryClient(<ForgotPasswordForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Request password reset/i }),
    ).toBeInTheDocument();
  });

  it("displays validation error for an invalid email address", async () => {
    renderWithQueryClient(<ForgotPasswordForm />);

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Request password reset/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
  });

  it("shows validation error if the email field is empty", async () => {
    renderWithQueryClient(<ForgotPasswordForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /Request password reset/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
  });

  it("shows success message on successful mutation", async () => {
    // Mock the successful server response
    server.use(
      http.post("/_allauth/browser/v1/auth/password/request", () => {
        return new HttpResponse(null, { status: 200 });
      }),
    );

    renderWithQueryClient(<ForgotPasswordForm />);

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Request password reset/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "A password reset link should have been sent to your inbox, if an account existed with the email you provided.",
        ),
      ).toBeInTheDocument();
    });

    // Check if window.scrollTo was called (if applicable)
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("displays error message if mutation fails", async () => {
    // Mock the error response from the server
    server.use(
      http.post("/_allauth/browser/v1/auth/password/request", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithQueryClient(<ForgotPasswordForm />);

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Request password reset/i }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/A general error occurred/i)).toBeInTheDocument();
    });
  });
});
