import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import {
  createPublicationDetailsSlice,
  PublicationDetailsSlice,
} from "./createPublicationDetailsSlice";
import { sliceResetFns } from "../resetSlice";
import { ModelVariable, SoftwarePackage } from "../../../../models";

const mockPublicationDetails = {
  explanation: "Sample explanation",
  programmingLanguageId: 1,
  softwarePackages: [{ id: 1, name: "Test Package" } as SoftwarePackage],
  modelVariables: [{ id: 1, name: "Test Variable" } as ModelVariable],
  codeRepositoryUrl: "https://github.com/repository",
  dataUrl: "https://data.com",
  publicationDOI: "10.1000/xyz123",
};

describe("PublicationDetailsSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure a clean state
  beforeEach(() => {
    useTestStore = create<PublicationDetailsSlice>()((...a) => ({
      ...createPublicationDetailsSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    expect(result.current.publicationDetails).toEqual({
      explanation: "",
      programmingLanguageId: "",
      softwarePackages: [],
      modelVariables: [],
      codeRepositoryUrl: "",
      dataUrl: "",
      publicationDOI: "",
    });
  });

  it("should update publicationDetails with setPublicationDetails", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setPublicationDetails(mockPublicationDetails);
    });

    // Verify the publicationDetails are updated correctly
    expect(result.current.publicationDetails).toEqual(mockPublicationDetails);
  });

  it("should partially update publicationDetails while retaining previous data", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setPublicationDetails({
        explanation: "Initial Explanation",
        programmingLanguageId: 2,
      });
    });

    // Partially update the publicationDetails (just explanation)
    act(() => {
      result.current.setPublicationDetails({
        explanation: "Updated Explanation",
      });
    });

    // Ensure the explanation is updated, and the rest remains unchanged
    expect(result.current.publicationDetails).toEqual({
      explanation: "Updated Explanation",
      programmingLanguageId: 2,
      softwarePackages: [],
      modelVariables: [],
      codeRepositoryUrl: "",
      dataUrl: "",
      publicationDOI: "",
    });
  });

  it("should reset to the initial state using sliceResetFns", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setPublicationDetails(mockPublicationDetails);
    });

    expect(result.current.publicationDetails).toEqual(mockPublicationDetails);

    // Reset using the reset function added to sliceResetFns
    act(() => {
      sliceResetFns.forEach((resetFn) => resetFn());
    });

    // Verify that the state is reset to the initial state
    expect(result.current.publicationDetails).toEqual({
      explanation: "",
      programmingLanguageId: "",
      softwarePackages: [],
      modelVariables: [],
      codeRepositoryUrl: "",
      dataUrl: "",
      publicationDOI: "",
    });
  });
});
