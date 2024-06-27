export type Framework = {
  id: number | string;
  name: string;
  description: string;
  explanation: string;
  isNew?: boolean;
};

export type ProgrammingLanguage = {
  id: number | string;
  name: string;
};

export type SoftwarePackage = {
  id: string;
  name: string;
  description?: string;
  documentationUrl?: string;
  codeRepositoryUrl?: string;
  programmingLanguageId: string | number;
};

export type ModelVariable = {
  id: string;
  name: string;
  description: string;
};
