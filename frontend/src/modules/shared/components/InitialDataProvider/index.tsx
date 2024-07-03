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

    if (initialData.frameworks) {
      setFrameworks(initialData.frameworks);
    }
    if (initialData.programmingLanguages) {
      setProgrammingLanguages(initialData.programmingLanguages);
    }
    if (initialData.psychologyDisciplines) {
      setPsychologyDisciplines(initialData.psychologyDisciplines);
    }
  }, []);

  return <>{children}</>;
};

export default InitialDataProvider;
