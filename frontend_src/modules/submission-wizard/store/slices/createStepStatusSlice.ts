import { StateCreator } from "zustand";

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

export const createStepStatusSlice: StateCreator<StepSlice> = (set) => ({
  completedStatus: {
    submissionGuidelines: false,
    account: false,
    modelInformation: false,
    publicationDetails: false,
    review: false,
  },
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
});

export type { StepSlice };
