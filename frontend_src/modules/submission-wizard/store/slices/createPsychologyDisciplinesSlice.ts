import { StateCreator } from "zustand";
import { PsychologyDiscipline } from "../../../../models";

type PsychologyDisciplinesSlice = {
  psychologyDisciplines: PsychologyDiscipline[];
  addPsychologyDiscipline: (data: PsychologyDiscipline) => void;
  setPsychologyDisciplines: (data: PsychologyDiscipline[]) => void;
};

const initialState = {
  psychologyDisciplines: [],
};

export const createPsychologyDisciplinesSlice: StateCreator<
  PsychologyDisciplinesSlice
> = (set) => {
  // do not reset this slice

  return {
    ...initialState,
    addPsychologyDiscipline: (data) =>
      set((state) => ({
        psychologyDisciplines: [...state.psychologyDisciplines, data],
      })),
    setPsychologyDisciplines: (data) =>
      set(() => ({
        psychologyDisciplines: data,
      })),
  };
};

export type { PsychologyDisciplinesSlice };
