import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "flowbite-react";
import axios from "axios";
import { removeDoiUrlPrefix } from "./util.ts";

interface Props {
  doiValue: string | undefined;
  hideErrors?: boolean;
  enabled?: boolean;
  children: (publication: string) => React.ReactNode;
}

export const PublicationMeta = ({
  doiValue,
  hideErrors,
  enabled = false,
  children,
}: Props) => {
  const { data, error } = useQuery({
    queryKey: ["doi_publication_search", doiValue],
    enabled,
    retry: false,

    queryFn: enabled
      ? async () => {
          const { data } = await axios.get(
            `${import.meta.env.VITE_SITE_URL}doi/lookup/${removeDoiUrlPrefix(doiValue || "")}`,
          );
          return data;
        }
      : undefined,
  });

  if (error && !hideErrors) {
    // @ts-expect-error response is somehow not defined on the error type
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

  return <>{children(data.toString())}</>;
};
