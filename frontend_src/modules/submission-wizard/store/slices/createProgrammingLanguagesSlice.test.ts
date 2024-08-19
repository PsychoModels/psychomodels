import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import {
  createProgrammingLanguagesSlice,
  ProgrammingLanguagesSlice,
} from "./createProgrammingLanguagesSlice";
import { ProgrammingLanguage } from "../../../../models";

const mockProgrammingLanguage: ProgrammingLanguage = {
  id: 1,
  name: "JavaScript",
};

const anotherMockProgrammingLanguage: ProgrammingLanguage = {
  id: 2,
  name: "Python",
};

describe("ProgrammingLanguagesSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure clean state
  beforeEach(() => {
    useTestStore = create<ProgrammingLanguagesSlice>()((...a) => ({
      ...createProgrammingLanguagesSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    // Verify the initial state is an empty programmingLanguages array
    expect(result.current.programmingLanguages).toEqual([]);
  });

  it("should set programmingLanguages using setProgrammingLanguages", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      // Use the setProgrammingLanguages action to set the array
      result.current.setProgrammingLanguages([mockProgrammingLanguage]);
    });

    // Verify the programmingLanguages array is updated correctly
    expect(result.current.programmingLanguages).toEqual([
      mockProgrammingLanguage,
    ]);
  });

  it("should add a programming language using addProgrammingLanguage", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      // Add a new programming language using addProgrammingLanguage action
      result.current.addProgrammingLanguage(mockProgrammingLanguage);
    });

    // Verify the programming language was added to the array
    expect(result.current.programmingLanguages).toEqual([
      mockProgrammingLanguage,
    ]);

    // Add another programming language and verify it is appended to the list
    act(() => {
      result.current.addProgrammingLanguage(anotherMockProgrammingLanguage);
    });

    // Verify the programmingLanguages array now contains both languages
    expect(result.current.programmingLanguages).toEqual([
      mockProgrammingLanguage,
      anotherMockProgrammingLanguage,
    ]);
  });

  it("should replace the programmingLanguages array when setProgrammingLanguages is called again", () => {
    const { result } = renderHook(() => useTestStore());

    // Set the programmingLanguages array initially
    act(() => {
      result.current.setProgrammingLanguages([mockProgrammingLanguage]);
    });

    expect(result.current.programmingLanguages).toEqual([
      mockProgrammingLanguage,
    ]);

    // Replace programmingLanguages array with a new one
    act(() => {
      result.current.setProgrammingLanguages([anotherMockProgrammingLanguage]);
    });

    // Verify the programmingLanguages array is replaced, not appended
    expect(result.current.programmingLanguages).toEqual([
      anotherMockProgrammingLanguage,
    ]);
  });
});
