import { StateCreator } from "zustand";
import { ProgrammingLanguage } from "../../../../models";

type ProgrammingLanguagesSlice = {
  programmingLanguages: ProgrammingLanguage[];
  addProgrammingLanguage: (data: ProgrammingLanguage) => void;
  setProgrammingLanguages: (data: ProgrammingLanguage[]) => void;
};

export const createProgrammingLanguagesSlice: StateCreator<
  ProgrammingLanguagesSlice
> = (set) => ({
  programmingLanguages: [],
  addProgrammingLanguage: (data) =>
    set((state) => ({
      programmingLanguages: [...state.programmingLanguages, data],
    })),
  setProgrammingLanguages: (data) =>
    set(() => ({
      programmingLanguages: data,
    })),
});

export type { ProgrammingLanguagesSlice };
