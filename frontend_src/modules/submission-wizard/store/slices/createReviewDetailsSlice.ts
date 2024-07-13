import { StateCreator } from "zustand";

type ReviewDetails = {
  remarks: string;
};

type ReviewDetailsSlice = {
  reviewDetails: ReviewDetails;
  setReviewDetails: (data: ReviewDetails) => void;
};

const initialState = {
  remarks: "",
};

export const createReviewDetailsSlice: StateCreator<ReviewDetailsSlice> = (
  set,
) => ({
  reviewDetails: initialState,
  setReviewDetails: (data) =>
    set((state) => ({
      reviewDetails: { ...state.reviewDetails, ...data },
    })),
});

export type { ReviewDetails, ReviewDetailsSlice };
