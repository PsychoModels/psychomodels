import React, { useEffect } from "react";
import useStore from "../../../submission-wizard/store/useStore.ts";
import { Framework, ProgrammingLanguage } from "../../../../models";

interface Props {
  children: React.ReactNode;
}

const InitialDataProvider = ({ children }: Props) => {
  const { setFrameworks, setProgrammingLanguages } = useStore((state) => state);
  useEffect(() => {
    // Retrieve the initial data from the script tag
    const initialDataScript = document.getElementById("initial-data");

    let initialData: {
      frameworks?: Framework[];
      programmingLanguages?: ProgrammingLanguage[];
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
  }, []);

  return <>{children}</>;
};

export default InitialDataProvider;
