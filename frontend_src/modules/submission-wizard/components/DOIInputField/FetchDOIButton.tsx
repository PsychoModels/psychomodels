import { Button } from "flowbite-react";
import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { removeDoiUrlPrefix } from "./util.ts";

interface Props {
  doiValue: string | undefined;
}

const DOI_REGEX = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

export const FetchDOIButton = ({ doiValue }: Props) => {
  const isValidDOI = DOI_REGEX.test(removeDoiUrlPrefix(doiValue?.trim() || ""));

  const { refetch, isRefetching, isLoading } = useQuery({
    queryKey: ["doi_publication_search", doiValue],
    queryFn: async () => {
      const { data } = await axios.get(
        `/doi/lookup/${removeDoiUrlPrefix(doiValue || "")}`,
      );
      return data;
    },
    enabled: false,
    retry: false,
  });

  const onClick = useCallback(() => {
    refetch();
  }, []);

  return (
    <Button
      isProcessing={isRefetching || isLoading}
      disabled={!isValidDOI}
      onClick={onClick}
      type="button"
      className="absolute end-2 top-2"
      color="dark"
    >
      Get details
    </Button>
  );
};
