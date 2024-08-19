import { StateCreator } from "zustand";
import { sliceResetFns } from "../resetSlice.ts";

type StepSlice = {
  completedStatus: {
    submissionGuidelines: boolean;
    account: boolean;
    modelInformation: boolean;
    publicationDetails: boolean;
    review: boolean;
  };
  setCompletedStatus: (
    name: keyof StepSlice["completedStatus"],
    value: boolean,
  ) => void;
};

const initialState = {
  completedStatus: {
    submissionGuidelines: false,
    account: false,
    modelInformation: false,
    publicationDetails: false,
    review: false,
  },
};

export const createStepStatusSlice: StateCreator<StepSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));

  return {
    ...initialState,
    setCompletedStatus: (
      name: keyof StepSlice["completedStatus"],
      value: boolean,
    ) =>
      set((state) => ({
        completedStatus: {
          ...state.completedStatus,
          [name]: value,
        },
      })),
  };
};

export type { StepSlice };
