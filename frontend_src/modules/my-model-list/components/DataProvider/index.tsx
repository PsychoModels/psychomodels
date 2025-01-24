import React, { useEffect, useState } from "react";

export type DraftModel = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string | null;
};

export type SubmittedModel = {
  id: number;
  title: string;
  published_at: string | null;
  updated_at: string;
  created_at: string;
  slug: string;
};

interface Props {
  children: (data: {
    draftModels: DraftModel[];
    submittedModels: SubmittedModel[];
  }) => React.ReactNode;
}

const DataProvider = ({ children }: Props) => {
  const [draftModels, setDraftModels] = useState<DraftModel[]>([]);
  const [submittedModels, setSubmittedModels] = useState<SubmittedModel[]>([]);

  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    // Retrieve the initial data from the script tag
    const initialDataScript = document.getElementById("data");

    let initialData: {
      models?: SubmittedModel[];
      drafts?: DraftModel[];
    } = {};

    if (initialDataScript?.textContent) {
      initialData = JSON.parse(initialDataScript.textContent);
    }

    setDraftModels(initialData.drafts || []);
    setSubmittedModels(initialData.models || []);

    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return <>{children({ draftModels, submittedModels })}</>;
};

export default DataProvider;
