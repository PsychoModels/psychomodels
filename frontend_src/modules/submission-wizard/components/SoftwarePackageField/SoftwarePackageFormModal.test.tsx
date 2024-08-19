import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { SoftwarePackageFormModal } from "./SoftwarePackageFormModal";

describe("SoftwarePackageFormModal", () => {
  const mockOnClose = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it("should render the modal with all form fields", () => {
    render(
      <SoftwarePackageFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={null}
      />,
    );

    expect(screen.getByText("Add software package")).toBeInTheDocument();
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Documentation url")).toBeInTheDocument();
    expect(screen.getByLabelText("Code repository url")).toBeInTheDocument();
    expect(screen.getByLabelText("Programming language*")).toBeInTheDocument();
  });

  it("should not submit the form when required fields are missing and show validation errors", async () => {
    render(
      <SoftwarePackageFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={null}
      />,
    );

    // Try to submit the form without filling in the required fields
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();

      expect(
        screen.getByText(/Software package name is required/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Programming language is required/i),
      ).toBeInTheDocument();
    });
  });
});
