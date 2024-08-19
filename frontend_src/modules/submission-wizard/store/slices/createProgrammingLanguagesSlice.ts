import { StateCreator } from "zustand";
import { ProgrammingLanguage } from "../../../../models";

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
> = (set) => {
  // do not reset this slice

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
