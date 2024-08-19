import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import { createStepStatusSlice, StepSlice } from "./createStepStatusSlice";
import { sliceResetFns } from "../resetSlice";

describe("StepStatusSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure a clean state
  beforeEach(() => {
    useTestStore = create<StepSlice>()((...a) => ({
      ...createStepStatusSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    expect(result.current.completedStatus).toEqual({
      submissionGuidelines: false,
      account: false,
      modelInformation: false,
      publicationDetails: false,
      review: false,
    });
  });

  it("should update a specific step's completedStatus using setCompletedStatus", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setCompletedStatus("submissionGuidelines", true);
    });

    // Verify that only submissionGuidelines was updated
    expect(result.current.completedStatus).toEqual({
      submissionGuidelines: true,
      account: false,
      modelInformation: false,
      publicationDetails: false,
      review: false,
    });
  });

  it("should update multiple step statuses individually", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setCompletedStatus("submissionGuidelines", true);
      result.current.setCompletedStatus("account", true);
    });

    // Verify that both steps were updated correctly
    expect(result.current.completedStatus).toEqual({
      submissionGuidelines: true,
      account: true,
      modelInformation: false,
      publicationDetails: false,
      review: false,
    });
  });

  it("should reset to the initial state using sliceResetFns", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setCompletedStatus("submissionGuidelines", true);
      result.current.setCompletedStatus("account", true);
      result.current.setCompletedStatus("publicationDetails", true);
    });

    expect(result.current.completedStatus).toEqual({
      submissionGuidelines: true,
      account: true,
      modelInformation: false,
      publicationDetails: true,
      review: false,
    });

    // Reset using the reset function added to sliceResetFns
    act(() => {
      sliceResetFns.forEach((resetFn) => resetFn());
    });

    // Verify that the state is reset to the initial state
    expect(result.current.completedStatus).toEqual({
      submissionGuidelines: false,
      account: false,
      modelInformation: false,
      publicationDetails: false,
      review: false,
    });
  });
});
