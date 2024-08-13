import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";
import "@testing-library/jest-dom";
import { SignupForm } from "./index.tsx";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";

describe("SignupForm", () => {
  const onSignupSuccessMock = vi.fn();

  it("renders the form fields correctly", () => {
    renderWithQueryClient(<SignupForm onSignupSuccess={onSignupSuccessMock} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Repeat password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign up/i }),
    ).toBeInTheDocument();
  });

  it("displays validation errors for invalid email and short password", async () => {
    renderWithQueryClient(<SignupForm onSignupSuccess={onSignupSuccessMock} />);

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });
    fireEvent.input(screen.getByLabelText("Repeat password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      const passwordErrors = screen.getAllByText(
        "The password must contain at least 8 characters",
      );
      expect(passwordErrors.length).toBe(2);
    });
  });

  it("displays validation error when passwords do not match", async () => {
    renderWithQueryClient(<SignupForm onSignupSuccess={onSignupSuccessMock} />);

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "validpassword123" },
    });
    fireEvent.input(screen.getByLabelText("Repeat password"), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("calls onSignupSuccess on successful sign-up", async () => {
    server.use(
      http.post("/_allauth/browser/v1/auth/signup", () => {
        return new HttpResponse(null, {
          status: 200,
        });
      }),
    );

    renderWithQueryClient(<SignupForm onSignupSuccess={onSignupSuccessMock} />);

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "validpassword123" },
    });
    fireEvent.input(screen.getByLabelText("Repeat password"), {
      target: { value: "validpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(onSignupSuccessMock).toHaveBeenCalled();
    });
  });

  it("displays an error message when the sign-up mutation fails", async () => {
    server.use(
      http.post("/_allauth/browser/v1/auth/signup", () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    renderWithQueryClient(<SignupForm onSignupSuccess={onSignupSuccessMock} />);

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "validpassword123" },
    });
    fireEvent.input(screen.getByLabelText("Repeat password"), {
      target: { value: "validpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/A general error occurred/i)).toBeInTheDocument();
    });
  });
});
