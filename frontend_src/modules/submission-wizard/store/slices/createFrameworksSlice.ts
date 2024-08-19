import { StateCreator } from "zustand";
import { Framework } from "../../../../models";

type FrameworksSlice = {
  frameworks: Framework[];
  addFramework: (data: Framework) => void;
  setFrameworks: (data: Framework[]) => void;
};

const initialState = {
  frameworks: [],
};

export const createFrameworksSlice: StateCreator<FrameworksSlice> = (set) => {
  // do not reset this slice

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
