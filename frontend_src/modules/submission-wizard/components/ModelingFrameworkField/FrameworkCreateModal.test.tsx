import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { FrameworkCreateModal } from "./FrameworkCreateModal";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import userEvent from "@testing-library/user-event";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("FrameworkCreateModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSelect = vi.fn();

  it("should render the form with all fields", () => {
    renderWithQueryClient(
      <FrameworkCreateModal
        show={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    expect(
      screen.getByText("Create new modeling framework"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Description*")).toBeInTheDocument();
    expect(screen.getByLabelText("How does it work*")).toBeInTheDocument();
    expect(screen.getByLabelText("Publication DOI")).toBeInTheDocument();
    expect(screen.getByLabelText("Documentation url")).toBeInTheDocument();
  });

  it("should show validation errors for required fields when trying to submit empty form", async () => {
    renderWithQueryClient(
      <FrameworkCreateModal
        show={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    await userEvent.type(
      screen.getByLabelText("Publication DOI"),
      "invalid-doi",
    );

    await userEvent.type(
      screen.getByLabelText("Documentation url"),
      "invalid-url",
    );

    fireEvent.click(screen.getByText("Save"));

    // Expect validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/How does the model work is required/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Invalid documentation URL/i),
      ).toBeInTheDocument();
    });
  });
});
