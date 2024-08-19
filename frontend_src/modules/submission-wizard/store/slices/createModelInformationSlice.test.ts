import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import {
  ModelInformationSlice,
  ModelInformation,
  createModelInformationSlice,
} from "./createModelInformationSlice";
import { sliceResetFns } from "../resetSlice.ts";

// Mock data for ModelInformation
const mockModelInformation: ModelInformation = {
  title: "Test Model",
  shortDescription: "This is a test description",
  frameworkIds: [1, 2, 3],
  psychologyDisciplineIds: [101, 102],
};

describe("ModelInformationSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure clean state
  beforeEach(() => {
    useTestStore = create<ModelInformationSlice>()((...a) => ({
      ...createModelInformationSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    expect(result.current.modelInformation).toEqual({
      title: "",
      shortDescription: "",
      frameworkIds: [],
      psychologyDisciplineIds: [],
    });
  });

  it("should update model information with setModelInformation", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setModelInformation(mockModelInformation);
    });

    // Verify that the modelInformation is updated correctly
    expect(result.current.modelInformation).toEqual(mockModelInformation);
  });

  it("should partially update model information while retaining previous data", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setModelInformation({
        title: "Initial Title",
        shortDescription: "Initial Description",
        frameworkIds: [1],
        psychologyDisciplineIds: [100],
      });
    });

    // Partially update the modelInformation (just title)
    act(() => {
      result.current.setModelInformation({ title: "Updated Title" });
    });

    // Ensure the title is updated, and the rest remains unchanged
    expect(result.current.modelInformation).toEqual({
      title: "Updated Title",
      shortDescription: "Initial Description",
      frameworkIds: [1],
      psychologyDisciplineIds: [100],
    });
  });

  it("should reset to the initial state using sliceResetFns", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setModelInformation(mockModelInformation);
    });

    expect(result.current.modelInformation).toEqual(mockModelInformation);

    // Reset using the reset function added to sliceResetFns
    act(() => {
      sliceResetFns.forEach((resetFn) => resetFn());
    });

    // Verify that the state is reset to the initial state
    expect(result.current.modelInformation).toEqual({
      title: "",
      shortDescription: "",
      frameworkIds: [],
      psychologyDisciplineIds: [],
    });
  });
});
