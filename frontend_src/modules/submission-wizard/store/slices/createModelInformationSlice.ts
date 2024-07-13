import { StateCreator } from "zustand";

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
  title: "Power-law of memory strength",
  shortDescription:
    "A model describing the memory-strength over time-lag. The decrease in memory-strength as built from several parameters is most closely represented by a simple power law.",
  frameworkIds: [1, 2],
  psychologyDisciplineIds: [1, 2],
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
