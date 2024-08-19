import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import {
  createPsychologyDisciplinesSlice,
  PsychologyDisciplinesSlice,
} from "./createPsychologyDisciplinesSlice";
import { PsychologyDiscipline } from "../../../../models";

const mockPsychologyDiscipline: PsychologyDiscipline = {
  id: 1,
  name: "Cognitive Psychology",
};

const anotherMockPsychologyDiscipline: PsychologyDiscipline = {
  id: 2,
  name: "Developmental Psychology",
};

describe("PsychologyDisciplinesSlice", () => {
  let useTestStore: any;

  // Reset Zustand store before each test to ensure clean state
  beforeEach(() => {
    useTestStore = create<PsychologyDisciplinesSlice>()((...a) => ({
      ...createPsychologyDisciplinesSlice(...a),
    }));
  });

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    expect(result.current.psychologyDisciplines).toEqual([]);
  });

  it("should set psychologyDisciplines using setPsychologyDisciplines", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setPsychologyDisciplines([mockPsychologyDiscipline]);
    });

    // Verify the psychologyDisciplines array is updated correctly
    expect(result.current.psychologyDisciplines).toEqual([
      mockPsychologyDiscipline,
    ]);
  });

  it("should add a psychology discipline using addPsychologyDiscipline", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.addPsychologyDiscipline(mockPsychologyDiscipline);
    });

    // Verify the discipline was added to the array
    expect(result.current.psychologyDisciplines).toEqual([
      mockPsychologyDiscipline,
    ]);

    act(() => {
      result.current.addPsychologyDiscipline(anotherMockPsychologyDiscipline);
    });

    // Verify the psychologyDisciplines array now contains both disciplines
    expect(result.current.psychologyDisciplines).toEqual([
      mockPsychologyDiscipline,
      anotherMockPsychologyDiscipline,
    ]);
  });

  it("should replace the psychologyDisciplines array when setPsychologyDisciplines is called again", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setPsychologyDisciplines([mockPsychologyDiscipline]);
    });

    expect(result.current.psychologyDisciplines).toEqual([
      mockPsychologyDiscipline,
    ]);

    // Replace psychologyDisciplines array with a new one
    act(() => {
      result.current.setPsychologyDisciplines([
        anotherMockPsychologyDiscipline,
      ]);
    });

    // Verify the psychologyDisciplines array is replaced, not appended
    expect(result.current.psychologyDisciplines).toEqual([
      anotherMockPsychologyDiscipline,
    ]);
  });
});
