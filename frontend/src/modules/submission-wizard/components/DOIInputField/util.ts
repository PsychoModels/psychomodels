export const removeDoiUrlPrefix = (doi: string): string => {
  const prefix = "https://doi.org/";

  if (doi.startsWith(prefix)) {
    return doi.replace(prefix, "");
  }

  return doi;
};
