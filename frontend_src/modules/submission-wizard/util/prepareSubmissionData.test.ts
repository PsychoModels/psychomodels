import { prepareSubmissionData } from "./prepareSubmissionData";
import { ModelInformationSlice } from "../store/slices/createModelInformationSlice";
import { FrameworksSlice } from "../store/slices/createFrameworksSlice";
import { PublicationDetailsSlice } from "../store/slices/createPublicationDetailsSlice";
import { ProgrammingLanguagesSlice } from "../store/slices/createProgrammingLanguagesSlice";
import { ReviewDetailsSlice } from "../store/slices/createReviewDetailsSlice";
import { PsychologyDisciplinesSlice } from "../store/slices/createPsychologyDisciplinesSlice";
import { VariableSlice } from "../store/slices/createVariableSlice";

// Mock data to simulate the store slices
const mockStore = {
  modelInformation: {
    title: "Test Title",
    shortDescription: "Test Description",
    frameworkIds: [],
    psychologyDisciplineIds: [],
  },
  publicationDetails: {
    explanation: "Test Explanation",
    publicationDOI: "10.1234/test.doi",
    programmingLanguageId: 1,
    softwarePackages: [],
    modelVariables: [],
  },
  programmingLanguages: [
    { id: 1, name: "Python", isNew: false },
    { id: 2, name: "JavaScript", isNew: false },
  ],
  frameworks: [
    {
      id: 1,
      name: "TensorFlow",
      description: "ML framework",
      explanation: "Explanation for TensorFlow",
      publicationDOI: "10.1234/tf.doi",
      isNew: false,
    },
    {
      id: "NEW--345",
      name: "PyTorch",
      description: "Another ML framework",
      explanation: "Explanation for PyTorch",
      publicationDOI: "10.5678/pt.doi",
      isNew: true,
    },
  ],
  psychologyDisciplines: [],
  reviewDetails: {
    remarks: null,
  },
  variables: [],
} as unknown as ModelInformationSlice &
  FrameworksSlice &
  PublicationDetailsSlice &
  ProgrammingLanguagesSlice &
  ReviewDetailsSlice &
  PsychologyDisciplinesSlice &
  VariableSlice;

describe("prepareSubmissionData", () => {
  it("should prepare submission data with existing programming language", () => {
    const result = prepareSubmissionData(mockStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: {
        id: 1,
      },
      framework: [],
      software_package: [],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should prepare submission data with new programming language", () => {
    const newLanguageStore = {
      ...mockStore,
      publicationDetails: {
        ...mockStore.publicationDetails,
        programmingLanguageId: "NEW--123",
      },
      programmingLanguages: [
        ...mockStore.programmingLanguages,
        { id: "NEW--123", name: "Go", isNew: true },
      ],
    };

    const result = prepareSubmissionData(newLanguageStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: { name: "Go" },
      framework: [],
      software_package: [],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should handle null or missing values in store", () => {
    const missingValuesStore = {
      ...mockStore,
      modelInformation: {
        title: "",
        shortDescription: "",
        frameworkIds: [],
        psychologyDisciplineIds: [],
      },
      publicationDetails: {
        explanation: undefined,
        publicationDOI: undefined,
        programmingLanguageId: undefined,
        softwarePackages: [],
        modelVariables: [],
      },
      programmingLanguages: [],
      frameworks: [],
      psychologyDisciplines: [],
    };

    const result = prepareSubmissionData(missingValuesStore);

    expect(result).toEqual({
      title: "",
      description: "",
      explanation: null,
      publication_doi: null,
      programming_language: null,
      framework: [],
      software_package: [],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should prepare submission data with no frameworks if none are provided", () => {
    const noFrameworksStore = {
      ...mockStore,
      frameworks: [],
    };

    const result = prepareSubmissionData(noFrameworksStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: { id: 1 },
      framework: [],
      software_package: [],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should handle submission data when all frameworks are new", () => {
    const allNewFrameworksStore = {
      ...mockStore,
      modelInformation: {
        ...mockStore.modelInformation,
        frameworkIds: ["new--123", "new--456"],
      },
      frameworks: [
        {
          id: "new--123",
          name: "JAX",
          description: "Another new ML framework",
          explanation: "Explanation for JAX",
          publicationDOI: "10.9999/jax.doi",
          documentationUrl: "https://jax.com",
          isNew: true,
        },
        {
          id: "new--456",
          name: "Keras",
          description: "Deep learning API",
          explanation: "Explanation for Keras",
          publicationDOI: "10.8888/keras.doi",
          isNew: true,
        },
      ],
    };

    const result = prepareSubmissionData(allNewFrameworksStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: {
        id: 1,
      },
      framework: [
        {
          name: "JAX",
          description: "Another new ML framework",
          explanation: "Explanation for JAX",
          documentation_url: "https://jax.com",
          publication_doi: "10.9999/jax.doi",
        },
        {
          name: "Keras",
          description: "Deep learning API",
          explanation: "Explanation for Keras",
          documentation_url: null,
          publication_doi: "10.8888/keras.doi",
        },
      ],
      software_package: [],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should handle submission data when frameworks are a mix of new and existing", () => {
    const mixedFrameworksStore = {
      ...mockStore,
      modelInformation: {
        ...mockStore.modelInformation,
        frameworkIds: [123, "new--456"],
      },
      frameworks: [
        {
          id: 123,
          name: "TensorFlow",
          description: "ML framework",
          explanation: "Explanation for TensorFlow",
          publicationDOI: "10.1234/tf.doi",
          isNew: false,
        },
        {
          id: "new--456",
          name: "JAX",
          description: "Another new ML framework",
          explanation: "Explanation for JAX",
          publicationDOI: "10.9999/jax.doi",
          isNew: true,
        },
      ],
    };

    const result = prepareSubmissionData(mixedFrameworksStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: {
        id: 1,
      },
      framework: [
        {
          id: 123,
        },
        {
          name: "JAX",
          description: "Another new ML framework",
          explanation: "Explanation for JAX",
          documentation_url: null,
          publication_doi: "10.9999/jax.doi",
        },
      ],
      software_package: [],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should handle submission data when software packages are provided", () => {
    const softwarePackagesStore = {
      ...mockStore,
      programmingLanguages: [
        { id: 1, name: "Python", isNew: false },
        { id: "NEW__123", name: "JavaScript", isNew: true },
      ],
      publicationDetails: {
        ...mockStore.publicationDetails,
        softwarePackages: [
          {
            id: "NEW__123",
            name: "Package 1",
            description: "Package 1 description",
            documentationUrl: "https://package1.com",
            codeRepositoryUrl: "https://package1.com/repo",
            programmingLanguageId: 1,
          },
          {
            id: "NEW__456",
            name: "Package 2",
            description: "Package 2 description",
            documentationUrl: "https://package2.com",
            codeRepositoryUrl: "https://package2.com/repo",
            programmingLanguageId: "NEW__123",
          },
        ],
      },
    };

    const result = prepareSubmissionData(softwarePackagesStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: {
        id: 1,
      },
      framework: [],
      software_package: [
        {
          name: "Package 1",
          description: "Package 1 description",
          documentation_url: "https://package1.com",
          code_repository_url: "https://package1.com/repo",
          programming_language: {
            id: 1,
          },
        },
        {
          name: "Package 2",
          description: "Package 2 description",
          documentation_url: "https://package2.com",
          code_repository_url: "https://package2.com/repo",
          programming_language: {
            name: "JavaScript",
          },
        },
      ],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should handle submission data when psychology disciplines are provided", () => {
    const psychologyDisciplinesStore = {
      ...mockStore,
      psychologyDisciplines: [
        { id: 1, name: "Discipline 1", isNew: false },
        { id: "NEW__123", name: "Discipline 2", isNew: true },
      ],
      modelInformation: {
        ...mockStore.modelInformation,
        psychologyDisciplineIds: [1, "NEW__123"],
      },
    };

    const result = prepareSubmissionData(psychologyDisciplinesStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: { id: 1 },
      framework: [],
      software_package: [],
      psychology_discipline: [
        {
          id: 1,
        },
        {
          name: "Discipline 2",
        },
      ],
      code_repository_url: null,
      data_url: null,
      model_variable: [],
      submission_remarks: null,
    });
  });

  it("should handle submission data when model variables are provided", () => {
    const modelVariablesStore = {
      ...mockStore,
      publicationDetails: {
        ...mockStore.publicationDetails,
        modelVariables: [
          {
            id: "NEW__123",
            name: "Variable 1",
            details: "Variable 1 details",
            variableId: 999,
          },
          {
            id: "NEW__456",
            name: "Variable 2",
            details: "Variable 2 details",
            variableId: "NEW__VARIABLE_123",
          },
        ],
      },
      variables: [
        { id: 999, name: "Variable 1", description: "Variable 1 description" },
        {
          id: "NEW__VARIABLE_123",
          name: "Variable 2",
          description: "Variable 2 description",
          isNew: true,
        },
      ],
    };

    const result = prepareSubmissionData(modelVariablesStore);

    expect(result).toEqual({
      title: "Test Title",
      description: "Test Description",
      explanation: "Test Explanation",
      publication_doi: "10.1234/test.doi",
      programming_language: {
        id: 1,
      },
      framework: [],
      software_package: [],
      psychology_discipline: [],
      code_repository_url: null,
      data_url: null,
      model_variable: [
        {
          name: "Variable 1",
          details: "Variable 1 details",
          variable: {
            id: 999,
          },
        },
        {
          name: "Variable 2",
          details: "Variable 2 details",
          variable: {
            name: "Variable 2",
            description: "Variable 2 description",
          },
        },
      ],
      submission_remarks: null,
    });
  });
});
