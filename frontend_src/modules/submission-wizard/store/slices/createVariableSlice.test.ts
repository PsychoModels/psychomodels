import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import { createVariableSlice, VariableSlice } from "./createVariableSlice";
import { Variable } from "../../../../models";

const mockVariable: Variable = {
  id: 1,
  name: "Test Variable",
  description: "Test Description",
};

const anotherMockVariable: Variable = {
  id: 2,
  name: "Another Test Variable",
  description: "Another Test Description",
};

describe("VariableSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure clean state
  beforeEach(() => {
    useTestStore = create<VariableSlice>()((...a) => ({
      ...createVariableSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    // Verify the initial state of variables is an empty array
    expect(result.current.variables).toEqual([]);
  });

  it("should set variables using setVariables", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setVariables([mockVariable]);
    });

    // Verify the variables array is updated correctly
    expect(result.current.variables).toEqual([mockVariable]);
  });

  it("should add a variable using addVariable", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.addVariable(mockVariable);
    });

    // Verify the variable was added to the array
    expect(result.current.variables).toEqual([mockVariable]);

    // Add another variable and verify it is appended to the list
    act(() => {
      result.current.addVariable(anotherMockVariable);
    });

    // Verify the variables array now contains both variables
    expect(result.current.variables).toEqual([
      mockVariable,
      anotherMockVariable,
    ]);
  });

  it("should replace the variables array when setVariables is called again", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setVariables([mockVariable]);
    });

    expect(result.current.variables).toEqual([mockVariable]);

    // Replace variables array with a new one
    act(() => {
      result.current.setVariables([anotherMockVariable]);
    });

    // Verify the variables array is replaced, not appended
    expect(result.current.variables).toEqual([anotherMockVariable]);
  });
});
