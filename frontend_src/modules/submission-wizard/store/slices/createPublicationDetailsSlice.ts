import { StateCreator } from "zustand";
import { ModelVariable, SoftwarePackage } from "../../../../models";
import { sliceResetFns } from "../resetSlice.ts";

type PublicationDetails = {
  explanation?: string;
  programmingLanguageId?: number | string;
  softwarePackages: SoftwarePackage[];
  modelVariables: ModelVariable[];
  codeRepositoryUrl?: string;
  dataUrl?: string;
  publicationDOI?: string;
};

type PublicationDetailsSlice = {
  publicationDetails: PublicationDetails;
  setPublicationDetails: (data: PublicationDetails) => void;
};

const initialState = {
  publicationDetails: {
    explanation: "",
    programmingLanguageId: "",
    softwarePackages: [],
    modelVariables: [],
    codeRepositoryUrl: "",
    dataUrl: "",
    publicationDOI: "",
  },
};

export const createPublicationDetailsSlice: StateCreator<
  PublicationDetailsSlice
> = (set) => {
  sliceResetFns.add(() => set(initialState));

  return {
    ...initialState,
    setPublicationDetails: (data) =>
      set((state) => ({
        publicationDetails: { ...state.publicationDetails, ...data },
      })),
  };
};

export type { PublicationDetails, PublicationDetailsSlice };
