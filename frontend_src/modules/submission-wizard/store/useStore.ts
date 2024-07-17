import { create } from "zustand";
import {
  ModelInformationSlice,
  createModelInformationSlice,
} from "./slices/createModelInformationSlice";

import { createStepStatusSlice, StepSlice } from "./slices/createStepStatusSlice.ts";
import {
  createFrameworksSlice,
  FrameworksSlice,
} from "./slices/createFrameworksSlice";
import {
  createPublicationDetailsSlice,
  PublicationDetailsSlice,
} from "./slices/createPublicationDetailsSlice";
import {
  createProgrammingLanguagesSlice,
  ProgrammingLanguagesSlice,
} from "./slices/createProgrammingLanguagesSlice.ts";
import {
  createReviewDetailsSlice,
  ReviewDetailsSlice,
} from "./slices/createReviewDetailsSlice.ts";
import {
  createPsychologyDisciplinesSlice,
  PsychologyDisciplinesSlice,
} from "./slices/createPsychologyDisciplinesSlice.ts";

const useStore = create<
  ModelInformationSlice &
    StepSlice &
    FrameworksSlice &
    PublicationDetailsSlice &
    ProgrammingLanguagesSlice &
    ReviewDetailsSlice &
    PsychologyDisciplinesSlice
>()((...a) => ({
  ...createStepStatusSlice(...a),
  ...createModelInformationSlice(...a),
  ...createFrameworksSlice(...a),
  ...createPublicationDetailsSlice(...a),
  ...createProgrammingLanguagesSlice(...a),
  ...createReviewDetailsSlice(...a),
  ...createPsychologyDisciplinesSlice(...a),
}));

export default useStore;
