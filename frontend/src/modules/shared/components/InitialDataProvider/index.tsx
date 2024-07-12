import React, { useEffect } from "react";
import useStore from "../../../submission-wizard/store/useStore.ts";
import {
  Framework,
  ProgrammingLanguage,
  PsychologyDiscipline,
} from "../../../../models";

interface Props {
  children: React.ReactNode;
}

const InitialDataProvider = ({ children }: Props) => {
  const { setFrameworks, setProgrammingLanguages, setPsychologyDisciplines } =
    useStore((state) => state);

  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    // Retrieve the initial data from the script tag
    const initialDataScript = document.getElementById("initial-data");

    let initialData: {
      frameworks?: Framework[];
      programmingLanguages?: ProgrammingLanguage[];
      psychologyDisciplines?: PsychologyDiscipline[];
    } = {};

    if (initialDataScript?.textContent) {
      initialData = JSON.parse(initialDataScript.textContent);
    }

    setFrameworks(initialData.frameworks || []);
    setProgrammingLanguages(initialData.programmingLanguages || []);
    setPsychologyDisciplines(initialData.psychologyDisciplines || []);

    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return <>{children}</>;
};

export default InitialDataProvider;
