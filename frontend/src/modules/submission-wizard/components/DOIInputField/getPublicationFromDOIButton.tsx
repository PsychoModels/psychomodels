import { Button } from "flowbite-react";
import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFormContext } from "react-hook-form";

interface Props {
  doiValue: string | undefined;
}

const DOI_REGEX = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

function removeDoiUrlPrefix(doi: string): string {
  const prefix = "https://doi.org/";

  if (doi.startsWith(prefix)) {
    return doi.replace(prefix, "");
  }

  return doi;
}

export const GetPublicationFromDOIButton = ({ doiValue }: Props) => {
  const isValidDOI = DOI_REGEX.test(removeDoiUrlPrefix(doiValue || ""));

  const { setValue, trigger, formState } = useFormContext();

  const { refetch, isRefetching } = useQuery({
    queryKey: ["doi_publication_search", doiValue],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}doi/lookup/${removeDoiUrlPrefix(doiValue || "")}`,
      );
      return data;
    },
    enabled: false,
    retry: false,
  });

  const revalidataFormField = useCallback((fieldName: string) => {
    if (formState.errors[fieldName]) {
      trigger(fieldName);
    }
  }, []);

  const onClick = useCallback(() => {
    console.log("Callback");

    refetch().then((result) => {
      console.debug("result", result);

      const data = result.data;
      if (data?.title) {
        setValue("publication.title", data.title);
        revalidataFormField("publication.title");
      }
      if (data?.["container-title"]) {
        setValue("publication.journal", data["container-title"]);
      }
      if (data?.publisher) {
        setValue("publication.publisher", data.publisher);
      }
      if (data?.page) {
        setValue("publication.year", data.page);
      }
      if (data?.volume) {
        setValue("publication.volume", data.volume);
      }
      if (data?.published) {
        setValue("publication.year", data.published["date-parts"][0][0]);
      }
    });
  }, []);

  return (
    <Button
      isProcessing={isRefetching}
      disabled={!isValidDOI}
      onClick={onClick}
      type="button"
      className="absolute end-2 top-2"
      color="dark"
    >
      Get BibText
    </Button>
  );
};
