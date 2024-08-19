import { ModelInformationSlice } from "../store/slices/createModelInformationSlice.ts";
import { FrameworksSlice } from "../store/slices/createFrameworksSlice.ts";
import { PublicationDetailsSlice } from "../store/slices/createPublicationDetailsSlice.ts";
import { ProgrammingLanguagesSlice } from "../store/slices/createProgrammingLanguagesSlice.ts";
import { ReviewDetailsSlice } from "../store/slices/createReviewDetailsSlice.ts";
import { PsychologyDisciplinesSlice } from "../store/slices/createPsychologyDisciplinesSlice.ts";
import { VariableSlice } from "../store/slices/createVariableSlice.ts";

type SoftwarePackage = {
  name: string;
  description: string | null;
  documentation_url: string | null;
  code_repository_url: string | null;
  programming_language:
    | {
        name: string;
      }
    | {
        id: number;
      }
    | null;
};

export type PsychologyModelSubmissionData = {
  title: string;
  description: string;
  explanation: string | null;

  publication_doi: string | null;

  programming_language:
    | {
        name: string;
      }
    | {
        id: number;
      }
    | null;

  framework: (
    | {
        name: string;
        description: string;
        explanation: string;
        publication_doi: string | null;
        documentation_url: string | null;
      }
    | {
        id: number;
      }
  )[];

  software_package: SoftwarePackage[];

  psychology_discipline: (
    | {
        name: string;
      }
    | {
        id: number;
      }
  )[];

  code_repository_url: string | null;
  data_url: string | null;

  model_variable: {
    name: string;
    details: string;
    variable:
      | {
          name: string;
          description: string;
        }
      | { id: number }
      | null;
  }[];

  submission_remarks: string | null;
};

export const prepareSubmissionData = (
  store: ModelInformationSlice &
    FrameworksSlice &
    PublicationDetailsSlice &
    ProgrammingLanguagesSlice &
    ReviewDetailsSlice &
    PsychologyDisciplinesSlice &
    VariableSlice,
): PsychologyModelSubmissionData => {
  const programmingLanguage = store.programmingLanguages.find(
    (item) => item.id == store.publicationDetails.programmingLanguageId,
  );

  let programming_language = null;
  if (programmingLanguage?.isNew) {
    programming_language = {
      name: programmingLanguage.name,
    };
  } else if (programmingLanguage) {
    programming_language = {
      id: parseInt(programmingLanguage.id.toString(), 10),
    };
  }

  const frameworks = store.modelInformation.frameworkIds.map(
    (id) => store.frameworks.find((item) => item.id === id)!,
  );

  const softwarePackages: SoftwarePackage[] =
    store.publicationDetails.softwarePackages.map((item) => {
      const programmingLanguage = store.programmingLanguages.find(
        (plItem) => plItem.id == item.programmingLanguageId,
      );

      let programming_language = null;
      if (programmingLanguage?.isNew) {
        programming_language = {
          name: programmingLanguage.name,
        };
      } else if (programmingLanguage) {
        programming_language = {
          id: parseInt(programmingLanguage.id.toString(), 10),
        };
      }

      return {
        name: item.name,
        description: item.description || null,
        documentation_url: item.documentationUrl || null,
        code_repository_url: item.codeRepositoryUrl || null,
        programming_language,
      };
    });

  const psychologyDisciplines =
    store.modelInformation.psychologyDisciplineIds.map(
      (id) => store.psychologyDisciplines.find((item) => item.id === id)!,
    );

  return {
    title: store.modelInformation.title,
    description: store.modelInformation.shortDescription,
    explanation: store.publicationDetails.explanation || null,

    publication_doi: store.publicationDetails.publicationDOI || null,

    programming_language,

    framework: frameworks.map((item) => {
      if (item.isNew) {
        return {
          name: item.name,
          description: item.description,
          explanation: item.explanation,
          publication_doi: item.publicationDOI || null,
          documentation_url: item.documentationUrl || null,
        };
      }
      return { id: parseInt(item.id.toString(), 10) };
    }),

    software_package: softwarePackages,

    psychology_discipline: psychologyDisciplines.map((item) => {
      if (item.isNew) {
        return {
          name: item.name,
        };
      }
      return { id: parseInt(item.id.toString(), 10) };
    }),

    code_repository_url: store.publicationDetails.codeRepositoryUrl || null,
    data_url: store.publicationDetails.dataUrl || null,

    model_variable: store.publicationDetails.modelVariables.map((item) => {
      const variableItem = store.variables.find(
        (variable) => variable.id === item.variableId,
      )!;

      let variable = null;
      if (variableItem?.isNew) {
        variable = {
          name: variableItem.name,
          description: variableItem.description,
        };
      } else if (variableItem) {
        variable = {
          id: parseInt(variableItem.id.toString(), 10),
        };
      }

      return {
        name: item.name,
        details: item.details,
        variable,
      };
    }),

    submission_remarks: store.reviewDetails.remarks || null,
  };
};
