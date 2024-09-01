type ID = string | number;

export type Framework = {
  id: ID;
  name: string;
  description: string;
  explanation: string;
  publicationDOI?: string;
  documentationUrl?: string;
  isNew?: boolean;
  slug?: string;
};

export type ProgrammingLanguage = {
  id: ID;
  name: string;
  isNew?: boolean;
};

export type SoftwarePackage = {
  id: ID;
  name: string;
  description?: string;
  documentationUrl?: string;
  codeRepositoryUrl?: string;
  programmingLanguageId: string | number;
};

export type ModelVariable = {
  id: ID;
  name: string;
  details: string;
  variableId: number | string;
};

export type Variable = {
  id: ID;
  name: string;
  description: string;
  isNew?: boolean;
};

export type PsychologyDiscipline = {
  id: ID;
  name: string;
  isNew?: boolean;
};

export type PsychologyModel = {
  title: string;
  shortDescription: string;
  frameworks: Framework[];
  psychologyDisciplines: PsychologyDiscipline[];
  explanation?: string;
  programmingLanguage: ProgrammingLanguage | undefined;
  softwarePackages: SoftwarePackage[];
  variables: ModelVariable[];
  codeRepositoryUrl?: string;
  dataUrl?: string;
  publicationDOI?: string;
};

export type Country = {
  code: string;
  name: string;
};
