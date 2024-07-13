import { StateCreator } from "zustand";
import { Framework } from "../../../../models";

type FrameworksSlice = {
  frameworks: Framework[];
  addFramework: (data: Framework) => void;
  setFrameworks: (data: Framework[]) => void;
};

export const createFrameworksSlice: StateCreator<FrameworksSlice> = (set) => ({
  frameworks: [
    {
      id: 1,
      name: "Framework 1",
      description: "Description 1",
      explanation: "Explanation 1",
    },
    {
      id: 2,
      name: "Framework 1",
      description: "Description 1",
      explanation: "Explanation 1",
    },
  ],
  addFramework: (data) => {
    set((state) => ({
      frameworks: [...state.frameworks, data],
    }));
  },
  setFrameworks: (data) =>
    set(() => ({
      frameworks: data,
    })),
});

export type { Framework, FrameworksSlice };
