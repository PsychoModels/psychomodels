import algoliasearch from "algoliasearch/lite";

import React from "react";
import { InstantSearch } from "react-instantsearch";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import { SearchContainer } from "./modules/search/component/SearchContainer";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_PUBLIC_API_KEY,
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
