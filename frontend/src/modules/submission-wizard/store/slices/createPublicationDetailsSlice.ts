import { StateCreator } from "zustand";
import { ModelVariable, SoftwarePackage } from "../../../../models";

type PublicationDetails = {
  explanation: string;
  programmingLanguageId: number | string;
  softwarePackages: SoftwarePackage[];
  variables: ModelVariable[];
  codeRepositoryUrl?: string;
  dataUrl?: string;
  publicationDOI?: string;
};

type PublicationDetailsSlice = {
  publicationDetails: PublicationDetails;
  setPublicationDetails: (data: PublicationDetails) => void;
};

const initialState = {
  explanation: "",
  programmingLanguageId: "",
  softwarePackages: [],
  variables: [],
  codeRepositoryUrl: "",
  dataUrl: "",
  publicationDOI: "",
};

export const createPublicationDetailsSlice: StateCreator<
  PublicationDetailsSlice
> = (set) => ({
  publicationDetails: initialState,
  setPublicationDetails: (data) =>
    set((state) => ({
      publicationDetails: { ...state.publicationDetails, ...data },
    })),
});

export type { PublicationDetails, PublicationDetailsSlice };
