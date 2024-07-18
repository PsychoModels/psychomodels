import { StateCreator } from "zustand";
import { Variable } from "../../../../models";

type VariableSlice = {
  variables: Variable[];
  addVariable: (data: Variable) => void;
  setVariables: (data: Variable[]) => void;
};

export const createVariableSlice: StateCreator<VariableSlice> = (set) => ({
  variables: [],
  addVariable: (data) =>
    set((state) => ({
      variables: [...state.variables, data],
    })),
  setVariables: (data) =>
    set(() => ({
      variables: data,
    })),
});

export type { VariableSlice };
