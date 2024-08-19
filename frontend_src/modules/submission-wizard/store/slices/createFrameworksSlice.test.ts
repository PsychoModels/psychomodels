import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import {
  createFrameworksSlice,
  FrameworksSlice,
} from "./createFrameworksSlice";
import { Framework } from "../../../../models";

const mockFramework: Framework = {
  id: 1,
  name: "Test Framework",
  description: "A test framework for testing",
  explanation: "An explanation of the test framework",
};

const anotherMockFramework: Framework = {
  id: 2,
  name: "Another Test Framework",
  description: "Another test framework for testing",
  explanation: "Another explanation of the test framework",
};

describe("FrameworksSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure clean state
  beforeEach(() => {
    useTestStore = create<FrameworksSlice>()((...a) => ({
      ...createFrameworksSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    // Verify the initial state is an empty frameworks array
    expect(result.current.frameworks).toEqual([]);
  });

  it("should set frameworks using setFrameworks", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setFrameworks([mockFramework]);
    });

    // Verify the frameworks array is updated correctly
    expect(result.current.frameworks).toEqual([mockFramework]);
  });

  it("should add a framework using addFramework", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.addFramework(mockFramework);
    });

    // Verify the framework was added to the array
    expect(result.current.frameworks).toEqual([mockFramework]);

    // Add another framework and verify it is added to the list
    act(() => {
      result.current.addFramework(anotherMockFramework);
    });

    // Verify the frameworks array now contains both frameworks
    expect(result.current.frameworks).toEqual([
      mockFramework,
      anotherMockFramework,
    ]);
  });

  it("should replace the frameworks array when setFrameworks is called again", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setFrameworks([mockFramework]);
    });

    expect(result.current.frameworks).toEqual([mockFramework]);

    // Replace frameworks array with a new one
    act(() => {
      result.current.setFrameworks([anotherMockFramework]);
    });

    // Verify the frameworks array is replaced, not appended
    expect(result.current.frameworks).toEqual([anotherMockFramework]);
  });
});
