import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ContactForm } from "./index.tsx";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { describe, vi } from "vitest";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";

// Mock window.scrollTo globally
// @ts-ignore
window.scrollTo = vi.fn();

describe("ContactForm", () => {
  it("renders the form elements", () => {
    renderWithQueryClient(<ContactForm />);

    expect(screen.getByLabelText("E-mail*")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject*")).toBeInTheDocument();
    expect(screen.getByLabelText("Your message*")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send message/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors if fields are empty", async () => {
    renderWithQueryClient(<ContactForm />);

    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    // Check if validation errors are shown
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it("shows a success message after submission", async () => {
    server.use(
      http.post("/api/contact/", () => {
        return new HttpResponse(null, {
          status: 200,
        });
      }),
    );

    renderWithQueryClient(<ContactForm />);

    await userEvent.type(screen.getByLabelText("E-mail*"), "test@example.com");
    await userEvent.type(screen.getByLabelText("Subject*"), "Test Subject");
    await userEvent.type(
      screen.getByLabelText("Your message*"),
      "Test Message",
    );

    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    await waitFor(() => {
      expect(screen.getByTestId("success-message")).toBeInTheDocument();
    });

    // Check if window.scrollTo was called
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("displays an error message when the mutation fails", async () => {
    server.use(
      http.post("/api/contact/", () => {
        // Simulate error response
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    renderWithQueryClient(<ContactForm />);

    await userEvent.type(screen.getByLabelText("E-mail*"), "test@example.com");
    await userEvent.type(screen.getByLabelText("Subject*"), "Test Subject");
    await userEvent.type(
      screen.getByLabelText("Your message*"),
      "Test Message",
    );

    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/A general error occurred/i)).toBeInTheDocument();
    });
  });
});
