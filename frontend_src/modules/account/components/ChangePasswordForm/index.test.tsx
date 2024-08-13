import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";

import { vi } from "vitest";
import { ChangePasswordForm } from "./index.tsx";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";

// Mock window.scrollTo globally
// @ts-ignore
window.scrollTo = vi.fn();

describe("ChangePasswordForm", () => {
  it("renders the form fields correctly", () => {
    renderWithQueryClient(<ChangePasswordForm />);

    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Repeat new password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Change password/i }),
    ).toBeInTheDocument();
  });

  it("displays an error if passwords do not match", async () => {
    renderWithQueryClient(<ChangePasswordForm />);

    fireEvent.input(screen.getByLabelText("Current password"), {
      target: { value: "currentpassword" },
    });
    fireEvent.input(screen.getByLabelText("New password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.input(screen.getByLabelText("Repeat new password"), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Change password/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("shows validation errors if fields are empty", async () => {
    renderWithQueryClient(<ChangePasswordForm />);

    fireEvent.click(screen.getByRole("button", { name: /Change password/i }));

    // Check if validation errors are shown
    await waitFor(() => {
      expect(
        screen.getByText("The password must contain at least 8 characters"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("The new password must contain at least 8 characters"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "The repeated new password must contain at least 8 characters",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows success message on successful mutation", async () => {
    server.use(
      http.post("/_allauth/browser/v1/account/password/change", () => {
        return new HttpResponse(null, {
          status: 200,
        });
      }),
    );

    renderWithQueryClient(<ChangePasswordForm />);

    fireEvent.input(screen.getByLabelText("Current password"), {
      target: { value: "currentpassword" },
    });
    fireEvent.input(screen.getByLabelText("New password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.input(screen.getByLabelText("Repeat new password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Change password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Your password has been successfully changed."),
      ).toBeInTheDocument();
    });

    // Check if window.scrollTo was called
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("displays error message if mutation fails", async () => {
    server.use(
      http.post("/_allauth/browser/v1/account/password/change", () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );
    renderWithQueryClient(<ChangePasswordForm />);

    fireEvent.input(screen.getByLabelText("Current password"), {
      target: { value: "currentpassword" },
    });
    fireEvent.input(screen.getByLabelText("New password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.input(screen.getByLabelText("Repeat new password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Change password/i }));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/A general error occurred/i)).toBeInTheDocument();
    });
  });
});
