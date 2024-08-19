import { StateCreator } from "zustand";
import { sliceResetFns } from "../resetSlice.ts";

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
) => {
  sliceResetFns.add(() => set(initialState));

  return {
    ...initialState,
    setReviewDetails: (data) =>
      set((state) => ({
        reviewDetails: { ...state.reviewDetails, ...data },
      })),
  };
};

export type { ReviewDetails, ReviewDetailsSlice };
