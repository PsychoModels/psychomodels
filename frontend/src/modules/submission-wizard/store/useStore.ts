import { create } from "zustand";
import {
  ModelInformationSlice,
  createModelInformationSlice,
} from "./slices/createModelInformationSlice";

import { createStepSlice, StepSlice } from "./slices/createStepSlice";
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
  ...createStepSlice(...a),
  ...createModelInformationSlice(...a),
  ...createFrameworksSlice(...a),
  ...createPublicationDetailsSlice(...a),
  ...createProgrammingLanguagesSlice(...a),
  ...createReviewDetailsSlice(...a),
  ...createPsychologyDisciplinesSlice(...a),
}));

export default useStore;
