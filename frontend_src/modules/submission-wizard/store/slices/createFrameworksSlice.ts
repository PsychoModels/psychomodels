import { StateCreator } from "zustand";
import { Framework } from "../../../../models";
import { draftSliceSerializeFns } from "../serializeDraftSlice.ts";

type FrameworksSlice = {
  frameworks: Framework[];
  addFramework: (data: Framework) => void;
  setFrameworks: (data: Framework[]) => void;
};

const initialState = {
  frameworks: [],
};

export const createFrameworksSlice: StateCreator<FrameworksSlice> = (
  set,
  getState,
) => {
  // do not reset this slice

  // only serialize new frameworks for draft submission
  draftSliceSerializeFns.add(() => ({
    frameworks: getState().frameworks.filter((f) => f.isNew),
  }));

  return {
    ...initialState,
    addFramework: (data) => {
      set((state) => ({
        frameworks: [...state.frameworks, data],
      }));
    },
    setFrameworks: (data) =>
      set(() => ({
        frameworks: data,
      })),
  };
};

export type { Framework, FrameworksSlice };
