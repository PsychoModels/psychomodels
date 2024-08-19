import { StateCreator } from "zustand";
import { sliceResetFns } from "../resetSlice.ts";

type ModelInformation = {
  title: string;
  shortDescription: string;
  frameworkIds: (string | number)[];
  psychologyDisciplineIds: (string | number)[];
};

type ModelInformationSlice = {
  modelInformation: ModelInformation;
  setModelInformation: (data: ModelInformation) => void;
};

const initialState = {
  modelInformation: {
    title: "",
    shortDescription: "",
    frameworkIds: [],
    psychologyDisciplineIds: [],
  },
};

export const createModelInformationSlice: StateCreator<
  ModelInformationSlice
> = (set) => {
  sliceResetFns.add(() => set(initialState));

  return {
    ...initialState,
    setModelInformation: (data) =>
      set((state) => ({
        modelInformation: { ...state.modelInformation, ...data },
      })),
  };
};

export type { ModelInformation, ModelInformationSlice };
