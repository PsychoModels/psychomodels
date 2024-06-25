import { StateCreator } from "zustand";

type ModelInformation = {
  title: string;
  shortDescription: string;
  frameworkIds: (string | number)[];
};

type ModelInformationSlice = {
  modelInformation: ModelInformation;
  setModelInformation: (data: ModelInformation) => void;
};

const initialState = {
  title: "",
  shortDescription: "",
  frameworkIds: [1, 2],
};

export const createModelInformationSlice: StateCreator<
  ModelInformationSlice
> = (set) => ({
  modelInformation: initialState,
  setModelInformation: (data) =>
    set((state) => ({
      modelInformation: { ...state.modelInformation, ...data },
    })),
});

export type { ModelInformation, ModelInformationSlice };
