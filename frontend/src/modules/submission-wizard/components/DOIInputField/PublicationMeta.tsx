import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "flowbite-react";

interface Props {
  doiValue: string | undefined;
}

export const PublicationMeta = ({ doiValue }: Props) => {
  const { data, error } = useQuery({
    queryKey: ["doi_publication_search", doiValue],
    enabled: false,
    retry: false,
  });

  if (error) {
    if (error?.response?.status === 404) {
      return (
        <Alert color="warning" className="mt-4">
          <span className="font-medium">DOI not found:</span> Could not fetch
          publication details. Please check the DOI.
        </Alert>
      );
    } else {
      return (
        <Alert color="failure" className="mt-4">
          <span className="font-medium">Error:</span> Could not fetch
          publication details. Please try again.
        </Alert>
      );
    }
  }
  if (!data) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 table-auto mt-4 text-sm">
      {data.toString()}
    </div>
  );
};
