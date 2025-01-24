import { StateCreator } from "zustand";
import { sliceResetFns } from "../resetSlice.ts";

type DraftStateSlice = {
  draftState: {
    id: number | null;
    lastSaved: Date | null;
  };
  setDraftSavedStatus: (id: number) => void;
  setDraftId: (id: number) => void;
};

const initialState = {
  draftState: {
    id: null,
    lastSaved: null,
  },
};

export const createDraftStateSlice: StateCreator<DraftStateSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));

  return {
    ...initialState,
    setDraftSavedStatus: (id: number) =>
      set(() => ({
        draftState: {
          id,
          lastSaved: new Date(),
        },
      })),
    setDraftId: (id: number) =>
      set(() => ({
        draftState: {
          id,
          lastSaved: null,
        },
      })),
  };
};

export type { DraftStateSlice };
