import React, { useEffect } from "react";
import useStore from "../../../submission-wizard/store/useStore.ts";
import { Framework } from "../../../submission-wizard/store/slices/createFrameworksSlice.ts";

interface Props {
  children: React.ReactNode;
}

const InitialDataProvider = ({ children }: Props) => {
  const { setFrameworks } = useStore((state) => state);
  useEffect(() => {
    // Retrieve the initial data from the script tag
    const initialDataScript = document.getElementById("initial-data");
    let initialData: {
      frameworks?: Framework[];
    } = {};
    if (initialDataScript?.textContent) {
      initialData = JSON.parse(initialDataScript.textContent);
    }

    if (initialData.frameworks) {
      setFrameworks(initialData.frameworks);
    }
  }, []);

  return <>{children}</>;
};

export default InitialDataProvider;
