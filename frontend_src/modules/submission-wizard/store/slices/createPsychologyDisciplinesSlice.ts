import { StateCreator } from "zustand";
import { PsychologyDiscipline } from "../../../../models";

type PsychologyDisciplinesSlice = {
  psychologyDisciplines: PsychologyDiscipline[];
  addPsychologyDiscipline: (data: PsychologyDiscipline) => void;
  setPsychologyDisciplines: (data: PsychologyDiscipline[]) => void;
};

export const createPsychologyDisciplinesSlice: StateCreator<
  PsychologyDisciplinesSlice
> = (set) => ({
  psychologyDisciplines: [],
  addPsychologyDiscipline: (data) =>
    set((state) => ({
      psychologyDisciplines: [...state.psychologyDisciplines, data],
    })),
  setPsychologyDisciplines: (data) =>
    set(() => ({
      psychologyDisciplines: data,
    })),
});

export type { PsychologyDisciplinesSlice };
