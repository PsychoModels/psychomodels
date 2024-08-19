import { StateCreator } from "zustand";
import { Variable } from "../../../../models";

type VariableSlice = {
  variables: Variable[];
  addVariable: (data: Variable) => void;
  setVariables: (data: Variable[]) => void;
};

const initialState = {
  variables: [],
};

export const createVariableSlice: StateCreator<VariableSlice> = (set) => {
  // do not reset this slice

  return {
    ...initialState,
    addVariable: (data) =>
      set((state) => ({
        variables: [...state.variables, data],
      })),
    setVariables: (data) =>
      set(() => ({
        variables: data,
      })),
  };
};

export type { VariableSlice };
