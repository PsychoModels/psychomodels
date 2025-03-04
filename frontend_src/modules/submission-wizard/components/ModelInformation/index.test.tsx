import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ModelInformation } from "./index.tsx";
import { useNavigate } from "@tanstack/react-router";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("ModelInformation", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
  });

  it("should render the form with all fields", () => {
    renderWithQueryClient(<ModelInformation />);

    expect(screen.getByLabelText("Title*")).toBeInTheDocument();
    expect(screen.getByLabelText("Short description*")).toBeInTheDocument();
    expect(screen.getByText("Modeling frameworks*")).toBeInTheDocument();
    expect(screen.getByText("Psychology disciplines")).toBeInTheDocument();
  });

  it("should show validation errors for the required fields", async () => {
    renderWithQueryClient(<ModelInformation />);

    fireEvent.click(screen.getByText(/model details/i));

    // Check if validation errors are shown
    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(
        screen.getByText("Short description is required"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("At least one framework is required"),
      ).toBeInTheDocument();
    });
  });
});
