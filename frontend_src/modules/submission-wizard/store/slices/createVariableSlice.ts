import { StateCreator } from "zustand";
import { Variable } from "../../../../models";
import { draftSliceSerializeFns } from "../serializeDraftSlice.ts";

type VariableSlice = {
  variables: Variable[];
  addVariable: (data: Variable) => void;
  setVariables: (data: Variable[]) => void;
};

const initialState = {
  variables: [],
};

export const createVariableSlice: StateCreator<VariableSlice> = (
  set,
  getState,
) => {
  // do not reset this slice

  // only serialize new variables for draft submission
  draftSliceSerializeFns.add(() => ({
    variables: getState().variables.filter((v) => v.isNew),
  }));

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
