import { StateCreator } from "zustand";
import { sliceResetFns } from "../resetSlice.ts";
import { draftSliceSerializeFns } from "../serializeDraftSlice.ts";

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
> = (set, getState) => {
  sliceResetFns.add(() => set(initialState));

  draftSliceSerializeFns.add(() => ({
    modelInformation: getState().modelInformation,
  }));

  return {
    ...initialState,
    setModelInformation: (data) =>
      set((state) => ({
        modelInformation: { ...state.modelInformation, ...data },
      })),
  };
};

export type { ModelInformation, ModelInformationSlice };
