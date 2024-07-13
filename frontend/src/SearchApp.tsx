import algoliasearch from "algoliasearch/lite";

import React from "react";
import { InstantSearch } from "react-instantsearch";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import { SearchContainer } from "./modules/search/component/SearchContainer";

const searchClient = algoliasearch(
  "7BGVHSZ032",
  "1d6a4aeac2b70a66ca38984f832964a1",
);

function SearchApp() {
  return (
    <ThemeProvider>
      <InstantSearch
        searchClient={searchClient}
        indexName="PsychologyModel"
        routing={true}
      >
        <SearchContainer></SearchContainer>
      </InstantSearch>
    </ThemeProvider>
  );
}

export default SearchApp;
