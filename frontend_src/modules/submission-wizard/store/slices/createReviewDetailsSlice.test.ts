import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import {
  createReviewDetailsSlice,
  ReviewDetailsSlice,
} from "./createReviewDetailsSlice";
import { sliceResetFns } from "../resetSlice";

const mockReviewDetails = {
  remarks: "This is a test remark.",
};

describe("ReviewDetailsSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure clean state
  beforeEach(() => {
    useTestStore = create<ReviewDetailsSlice>()((...a) => ({
      ...createReviewDetailsSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    expect(result.current.reviewDetails).toEqual({
      remarks: "",
    });
  });

  it("should update reviewDetails with setReviewDetails", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setReviewDetails(mockReviewDetails);
    });

    // Verify the reviewDetails are updated correctly
    expect(result.current.reviewDetails).toEqual(mockReviewDetails);
  });

  it("should partially update reviewDetails while retaining previous data", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setReviewDetails({
        remarks: "Initial remark",
      });
    });

    // Partially update the reviewDetails (update the remarks)
    act(() => {
      result.current.setReviewDetails({ remarks: "Updated remark" });
    });

    // Ensure the remarks are updated correctly
    expect(result.current.reviewDetails).toEqual({
      remarks: "Updated remark",
    });
  });

  it("should reset to the initial state using sliceResetFns", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setReviewDetails(mockReviewDetails);
    });

    expect(result.current.reviewDetails).toEqual(mockReviewDetails);

    // Reset using the reset function added to sliceResetFns
    act(() => {
      sliceResetFns.forEach((resetFn) => resetFn());
    });

    // Verify that the state is reset to the initial state
    expect(result.current.reviewDetails).toEqual({
      remarks: "",
    });
  });
});
