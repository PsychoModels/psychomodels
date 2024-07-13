import { StateCreator } from "zustand";

type StepSlice = {
  currentStep: number;
  goToStep: (step: number) => void;
};

export const createStepSlice: StateCreator<StepSlice> = (set) => ({
  currentStep: 1,
  goToStep: (newStep: number) =>
    set((state) => ({ ...state, currentStep: newStep })),
});

export type { StepSlice };
