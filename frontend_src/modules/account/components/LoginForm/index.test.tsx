import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";
import "@testing-library/jest-dom";
import { LoginForm } from "./index.tsx";

// @ts-ignore
window.scrollTo = vi.fn();

describe("LoginForm", () => {
  const onLoginSuccessMock = vi.fn();
  const forgotPasswordLinkMock = (
    <a href="/forgot-password">Forgot Password?</a>
  );

  it("renders the form fields and social login buttons correctly", () => {
    renderWithQueryClient(
      <LoginForm
        onLoginSuccess={onLoginSuccessMock}
        forgotPasswordLink={forgotPasswordLinkMock}
      />,
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText("or")).toBeInTheDocument();
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });

  it("displays validation errors for invalid email or short password", async () => {
    renderWithQueryClient(
      <LoginForm
        onLoginSuccess={onLoginSuccessMock}
        forgotPasswordLink={forgotPasswordLinkMock}
      />,
    );

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      expect(
        screen.getByText("The password must contain at least 8 characters"),
      ).toBeInTheDocument();
    });
  });

  it("displays validation error if the fields are empty", async () => {
    renderWithQueryClient(
      <LoginForm
        onLoginSuccess={onLoginSuccessMock}
        forgotPasswordLink={forgotPasswordLinkMock}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      expect(
        screen.getByText("The password must contain at least 8 characters"),
      ).toBeInTheDocument();
    });
  });

  it("calls onLoginSuccess on successful login", async () => {
    server.use(
      http.post("/_allauth/browser/v1/auth/login", () => {
        return new HttpResponse(null, {
          status: 200,
        });
      }),
    );

    renderWithQueryClient(
      <LoginForm
        onLoginSuccess={onLoginSuccessMock}
        forgotPasswordLink={forgotPasswordLinkMock}
      />,
    );

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "validpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(onLoginSuccessMock).toHaveBeenCalled();
    });

    // Check if window.scrollTo was called (if applicable)
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("displays error message if login fails", async () => {
    server.use(
      http.post("/_allauth/browser/v1/account/login/", () => {
        return HttpResponse.json(
          { error: "Invalid credentials" },
          {
            status: 400,
          },
        );
      }),
      http.post("/_allauth/browser/v1/auth/login", () => {
        return HttpResponse.json(
          {
            errors: [
              {
                message:
                  "The email address and/or password you specified are not correct.",
                code: "email_password_mismatch",
                param: "password",
              },
            ],
          },
          {
            status: 400,
          },
        );
      }),
    );

    renderWithQueryClient(
      <LoginForm
        onLoginSuccess={onLoginSuccessMock}
        forgotPasswordLink={forgotPasswordLinkMock}
      />,
    );

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "invalidpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(
        screen.getByText(
          "The email address and/or password you specified are not correct.",
        ),
      ).toBeInTheDocument();
    });
  });
});
