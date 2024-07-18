import React, { useEffect } from "react";
import useStore from "../../../submission-wizard/store/useStore.ts";
import {
  Framework,
  ProgrammingLanguage,
  PsychologyDiscipline,
  Variable,
} from "../../../../models";

interface Props {
  children: React.ReactNode;
}

const InitialDataProvider = ({ children }: Props) => {
  const {
    setFrameworks,
    setProgrammingLanguages,
    setPsychologyDisciplines,
    setVariables,
  } = useStore((state) => state);

  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    // Retrieve the initial data from the script tag
    const initialDataScript = document.getElementById("initial-data");

    let initialData: {
      frameworks?: Framework[];
      programmingLanguages?: ProgrammingLanguage[];
      psychologyDisciplines?: PsychologyDiscipline[];
      variables?: Variable[];
    } = {};

    if (initialDataScript?.textContent) {
      initialData = JSON.parse(initialDataScript.textContent);
    }

    setFrameworks(initialData.frameworks || []);
    setProgrammingLanguages(initialData.programmingLanguages || []);
    setPsychologyDisciplines(initialData.psychologyDisciplines || []);
    setVariables(initialData.variables || []);

    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return <>{children}</>;
};

export default InitialDataProvider;
