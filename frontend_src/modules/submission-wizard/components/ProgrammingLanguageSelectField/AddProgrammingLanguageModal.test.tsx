import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AddProgrammingLanguageModal } from "./AddProgrammingLanguageModal.tsx";

describe("AddProgrammingLanguageModal", () => {
  const mockOnClose = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the modal with the form fields", () => {
    render(
      <AddProgrammingLanguageModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
      />,
    );

    expect(
      screen.getByText("Add new programming language"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
  });

  it("should not call onChange when the form is invalid and show validation errors", async () => {
    render(
      <AddProgrammingLanguageModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
      />,
    );

    // Submit the form with an empty Name (invalid form)
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      // Ensure that onChange was not called due to validation failure
      expect(mockOnChange).not.toHaveBeenCalled();

      // Ensure that onClose was not called because the form wasn't valid
      expect(mockOnClose).not.toHaveBeenCalled();

      expect(
        screen.getByText(/Programming language name is required/i),
      ).toBeInTheDocument();
    });
  });
});
