import React from "react";
import { useInstantSearch } from "react-instantsearch";

interface Props {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export const NoResultsBoundary = ({ children, fallback }: Props) => {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
};
