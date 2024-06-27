import { StateCreator } from "zustand";
import { ModelVariable, SoftwarePackage } from "../../../../models";

type PublicationDetails = {
  name: string;
  explanation: string;
  programmingLanguageId: number | string;
  softwarePackages: SoftwarePackage[];
  variables: ModelVariable[];
};

type PublicationDetailsSlice = {
  publicationDetails: PublicationDetails;
  setPublicationDetails: (data: PublicationDetails) => void;
};

const initialState = {
  name: "",
  explanation: "",
  programmingLanguageId: "",
  softwarePackages: [],
  codeRepositoryUrl: "",
  dataUrl: "",
  variables: [],
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
