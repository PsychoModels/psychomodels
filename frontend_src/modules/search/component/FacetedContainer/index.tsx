import React from "react";
import { RefinementList } from "../RefinementList";

export const FacetedContainer = () => {
  return (
    <div className="flex-col flex gap-6">
      <RefinementList
        attribute="framework_names"
        label="Framework"
        searchablePlaceholder="Search for a framework"
      />

      <RefinementList
        attribute="programming_language_name"
        label="Programming language"
        searchablePlaceholder="Search for a programming language"
      />

      <RefinementList
        attribute="psychology_discipline_names"
        label="Discipline"
        searchablePlaceholder="Search for a discipline"
      />

      <RefinementList
        attribute="publication_authors"
        label="Publication authors"
        searchablePlaceholder="Search for a author"
      />
    </div>
  );
};
