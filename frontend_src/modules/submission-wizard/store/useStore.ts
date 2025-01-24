import { create } from "zustand";
import {
  ModelInformationSlice,
  createModelInformationSlice,
} from "./slices/createModelInformationSlice";

import {
  createStepStatusSlice,
  StepSlice,
} from "./slices/createStepStatusSlice.ts";
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
import {
  createVariableSlice,
  VariableSlice,
} from "./slices/createVariableSlice.ts";
import {
  CountriesSlice,
  createCountriesSlice,
} from "./slices/createCountriesSlice.ts";
import {
  createDraftStateSlice,
  DraftStateSlice,
} from "./slices/createDraftStateSlice.ts";

const useStore = create<
  ModelInformationSlice &
    StepSlice &
    FrameworksSlice &
    PublicationDetailsSlice &
    ProgrammingLanguagesSlice &
    ReviewDetailsSlice &
    PsychologyDisciplinesSlice &
    VariableSlice &
    CountriesSlice &
    DraftStateSlice
>()((...a) => ({
  // the order of the slices is pertinent for deserialization
  ...createStepStatusSlice(...a),
  ...createModelInformationSlice(...a),
  ...createFrameworksSlice(...a),
  ...createPublicationDetailsSlice(...a),
  ...createProgrammingLanguagesSlice(...a),
  ...createReviewDetailsSlice(...a),
  ...createPsychologyDisciplinesSlice(...a),
  ...createVariableSlice(...a),
  ...createCountriesSlice(...a),
  ...createDraftStateSlice(...a),
}));

export default useStore;
