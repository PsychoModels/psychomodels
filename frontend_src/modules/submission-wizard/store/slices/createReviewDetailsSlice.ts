import { StateCreator } from "zustand";
import { sliceResetFns } from "../resetSlice.ts";
import { draftSliceSerializeFns } from "../serializeDraftSlice.ts";

type ReviewDetails = {
  remarks: string;
};

type ReviewDetailsSlice = {
  reviewDetails: ReviewDetails;
  setReviewDetails: (data: ReviewDetails) => void;
};

const initialState = {
  reviewDetails: {
    remarks: "",
  },
};

export const createReviewDetailsSlice: StateCreator<ReviewDetailsSlice> = (
  set,
  getState,
) => {
  sliceResetFns.add(() => set(initialState));

  draftSliceSerializeFns.add(() => ({
    reviewDetails: getState().reviewDetails,
  }));

  return {
    ...initialState,
    setReviewDetails: (data) =>
      set((state) => ({
        reviewDetails: { ...state.reviewDetails, ...data },
      })),
  };
};

export type { ReviewDetails, ReviewDetailsSlice };
