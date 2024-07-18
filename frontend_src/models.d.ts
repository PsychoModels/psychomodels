type ID = string | number;

export type Framework = {
  id: ID;
  name: string;
  description: string;
  explanation: string;
  isNew?: boolean;
};

export type ProgrammingLanguage = {
  id: ID;
  name: string;
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
  variable: Variable;
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
};

export type PsychologyModel = {
  title: string;
  shortDescription: string;
  frameworks: Framework[];
  psychologyDisciplines: PsychologyDiscipline[];
  explanation: string;
  programmingLanguage: ProgrammingLanguage;
  softwarePackages: SoftwarePackage[];
  variables: ModelVariable[];
  codeRepositoryUrl?: string;
  dataUrl?: string;
  publicationDOI?: string;
};
