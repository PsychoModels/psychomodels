import React, { useEffect } from "react";
import useStore from "../../store/useStore.ts";

interface Props {
  children: React.ReactNode;
}

const ContinueEditDataProvider = ({ children }: Props) => {
  const {
    setDraftId,
    addFramework,
    setModelInformation,
    setPublicationDetails,
    setReviewDetails,
    addProgrammingLanguage,
    addPsychologyDiscipline,
    addVariable,
  } = useStore((state) => state);

  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    // Retrieve the initial data from the script tag
    const initialDataScript = document.getElementById("initial-data");

    let initialData: {
      existing_draft?: any;
      existing_model?: any;
    } = {};

    if (initialDataScript?.textContent) {
      initialData = JSON.parse(initialDataScript.textContent);
    }

    if (initialData.existing_draft) {
      const draftId = initialData.existing_draft.id;
      const draftData = initialData.existing_draft.data;

      setDraftId(draftId);

      if (draftData.frameworks) {
        draftData.frameworks.forEach((framework: any) => {
          addFramework(framework);
        });
      }

      if (draftData.programmingLanguages) {
        draftData.programmingLanguages.forEach((programmingLanguage: any) => {
          addProgrammingLanguage(programmingLanguage);
        });
      }
      if (draftData.psychologyDisciplines) {
        draftData.psychologyDisciplines.forEach((psychologyDiscipline: any) => {
          addPsychologyDiscipline(psychologyDiscipline);
        });
      }

      if (draftData.variables) {
        draftData.variables.forEach((variable: any) => {
          addVariable(variable);
        });
      }
      if (draftData.modelInformation) {
        setModelInformation(draftData.modelInformation);
      }

      if (draftData.publicationDetails) {
        setPublicationDetails(draftData.publicationDetails);
      }

      if (draftData.reviewDetails) {
        setReviewDetails(draftData.reviewDetails);
      }
    }

    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return <>{children}</>;
};

export default ContinueEditDataProvider;
