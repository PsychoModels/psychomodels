import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import useStore from "../../store/useStore";
import { VariableFormModal } from "./VariableFormModal"; // Adjust the import path

describe("VariableFormModal", () => {
  const mockOnClose = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mock calls between tests
    useStore.setState({ variables: [] });
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

    expect(
      screen.getByText("Add new variable to your model"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Label*")).toBeInTheDocument();
    expect(screen.getByLabelText("Details")).toBeInTheDocument();
  });

  it("allows toggling between existing variable and custom variable", async () => {
    render(
      <VariableFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={null}
      />,
    );

    // Initially, the "create custom variable" link should be shown
    const createCustomLink = screen.getByText("create new variable");
    expect(createCustomLink).toBeInTheDocument();

    // Click to create custom variable
    fireEvent.click(createCustomLink);

    await waitFor(() => {
      expect(screen.getByLabelText("Name*")).toBeInTheDocument();
      expect(screen.getByLabelText("Description*")).toBeInTheDocument();
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    // Toggle back to select existing variable
    const selectExistingLink = screen.getByText("select existing variable");
    fireEvent.click(selectExistingLink);

    // Ensure the existing variable select is shown again
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.queryByLabelText("Description*")).not.toBeInTheDocument();
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

  it("submits an existing variable without custom-variable fields", async () => {
    useStore.setState({
      variables: [
        {
          id: 7,
          name: "Existing variable",
          description: "Existing description",
        },
      ],
    });
    render(
      <VariableFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={{
          id: 11,
          variableId: 7,
          name: "Old label",
          details: "",
        }}
      />,
    );
    fireEvent.change(screen.getByLabelText("Label*"), {
      target: { value: "Updated label" },
    });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        id: 11,
        variableId: 7,
        name: "Updated label",
        details: "",
      });
    });
    expect(useStore.getState().variables).toHaveLength(1);
  });

  it("submits a custom variable without an existing variable ID", async () => {
    render(
      <VariableFormModal
        show={true}
        onClose={mockOnClose}
        onChange={mockOnChange}
        existingValue={null}
      />,
    );
    fireEvent.click(screen.getByText("create new variable"));
    fireEvent.change(screen.getByLabelText("Name*"), {
      target: { value: "New variable" },
    });
    fireEvent.change(screen.getByLabelText("Description*"), {
      target: { value: "New description" },
    });
    fireEvent.change(screen.getByLabelText("Label*"), {
      target: { value: "New label" },
    });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        id: expect.stringMatching(/^NEW--/),
        variableId: expect.stringMatching(/^NEW--/),
        name: "New label",
        details: "",
      });
    });
    expect(useStore.getState().variables).toContainEqual({
      id: expect.stringMatching(/^NEW--/),
      name: "New variable",
      description: "New description",
      isNew: true,
    });
  });
});
