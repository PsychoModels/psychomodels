import { create } from "zustand";
import {
  ModelInformationSlice,
  createModelInformationSlice,
} from "./slices/createModelInformationSlice.ts";

import { createStepSlice, StepSlice } from "./slices/createStepSlice";
import {
  createFrameworksSlice,
  FrameworksSlice,
} from "./slices/createFrameworksSlice.ts";

const useStore = create<ModelInformationSlice & StepSlice & FrameworksSlice>()(
  (...a) => ({
    ...createStepSlice(...a),
    ...createModelInformationSlice(...a),
    ...createFrameworksSlice(...a),
  }),
);

export default useStore;
