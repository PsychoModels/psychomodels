import { StateCreator } from "zustand";
import { PsychologyDiscipline } from "../../../../models";
import { draftSliceSerializeFns } from "../serializeDraftSlice.ts";

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
> = (set, getState) => {
  // do not reset this slice

  // only serialize new disciplines for draft submission
  draftSliceSerializeFns.add(() => ({
    psychologyDisciplines: getState().psychologyDisciplines.filter(
      (pd) => pd.isNew,
    ),
  }));

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
