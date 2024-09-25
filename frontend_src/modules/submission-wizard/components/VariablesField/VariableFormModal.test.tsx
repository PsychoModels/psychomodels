import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { VariableFormModal } from "./VariableFormModal"; // Adjust the import path

describe("VariableFormModal", () => {
  const mockOnClose = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mock calls between tests
  });

  it("renders the modal with form fields", () => {
    render(
      <VariableFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={null}
      />,
    );

    expect(screen.getByText("Add new variable to your model")).toBeInTheDocument();
    expect(screen.getByLabelText("Variable*")).toBeInTheDocument();
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Details")).toBeInTheDocument();
  });

  it("allows toggling between existing variable and custom variable", () => {
    render(
      <VariableFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={null}
      />,
    );

    // Initially, the "create custom variable" link should be shown
    const createCustomLink = screen.getByText("create custom variable");
    expect(createCustomLink).toBeInTheDocument();

    // Click to create custom variable
    fireEvent.click(createCustomLink);

    waitFor(() => {
      // Ensure the custom variable form fields are shown
      expect(screen.getByLabelText("Variable")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(screen.queryByLabelText("Variable*")).not.toBeInTheDocument(); // Existing variable select should be gone
    });

    // Toggle back to select existing variable
    const selectExistingLink = screen.getByText("select existing variable");
    fireEvent.click(selectExistingLink);

    // Ensure the existing variable select is shown again
    expect(screen.getByLabelText("Variable*")).toBeInTheDocument();
    expect(screen.queryByLabelText("Variable")).not.toBeInTheDocument();
  });

  it("does not submit the form if required fields are missing", async () => {
    render(
      <VariableFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={null}
      />,
    );

    // Try to submit without filling in required fields
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled(); // Form should not submit
      expect(mockOnClose).not.toHaveBeenCalled(); // Modal should not close
    });
  });
});
