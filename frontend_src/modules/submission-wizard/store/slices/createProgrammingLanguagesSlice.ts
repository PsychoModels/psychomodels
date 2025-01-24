import { StateCreator } from "zustand";
import { ProgrammingLanguage } from "../../../../models";
import { draftSliceSerializeFns } from "../serializeDraftSlice.ts";

type ProgrammingLanguagesSlice = {
  programmingLanguages: ProgrammingLanguage[];
  addProgrammingLanguage: (data: ProgrammingLanguage) => void;
  setProgrammingLanguages: (data: ProgrammingLanguage[]) => void;
};

const initialState = {
  programmingLanguages: [],
};

export const createProgrammingLanguagesSlice: StateCreator<
  ProgrammingLanguagesSlice
> = (set, getState) => {
  // do not reset this slice

  // only serialize new programming languages for draft submission
  draftSliceSerializeFns.add(() => ({
    programmingLanguages: getState().programmingLanguages.filter(
      (pl) => pl.isNew,
    ),
  }));

  return {
    ...initialState,
    addProgrammingLanguage: (data) =>
      set((state) => ({
        programmingLanguages: [...state.programmingLanguages, data],
      })),
    setProgrammingLanguages: (data) =>
      set(() => ({
        programmingLanguages: data,
      })),
  };
};

export type { ProgrammingLanguagesSlice };
