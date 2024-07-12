import algoliasearch from "algoliasearch/lite";

import React from "react";
import {
  InstantSearch,
  Breadcrumb,
  ClearRefinements,
  CurrentRefinements,
  DynamicWidgets,
  HierarchicalMenu,
  HitsPerPage,
  Menu,
  RangeInput,
  RefinementList,
  PoweredBy,
  SearchBox,
  SortBy,
  ToggleRefinement,
} from "react-instantsearch";

const searchClient = algoliasearch(
  "latency",
  "6be0576ff61c053d5f9a3225e2a90f76",
);

function SearchApp() {
  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName="instant_search"
        routing={true}
        insights={true}
      >
        <div className="Container">
          <div>
            <DynamicWidgets>
              <div>
                <RefinementList
                  attribute="brand"
                  searchable={true}
                  searchablePlaceholder="Search brands"
                  showMore={true}
                />
              </div>
              <div>
                <Menu attribute="categories" showMore={true} />
              </div>
              <div>
                <HierarchicalMenu
                  attributes={[
                    "hierarchicalCategories.lvl0",
                    "hierarchicalCategories.lvl1",
                    "hierarchicalCategories.lvl2",
                  ]}
                  showMore={true}
                />
              </div>
              <div>
                <RangeInput attribute="price" precision={1} />
              </div>
              <div>
                <ToggleRefinement
                  attribute="free_shipping"
                  label="Free shipping"
                />
              </div>
            </DynamicWidgets>
          </div>
          <div className="Search">
            <Breadcrumb
              attributes={[
                "hierarchicalCategories.lvl0",
                "hierarchicalCategories.lvl1",
                "hierarchicalCategories.lvl2",
              ]}
            />

            <SearchBox placeholder="Search" autoFocus />

            <div className="Search-header">
              <PoweredBy />
              <HitsPerPage
                items={[
                  { label: "20 hits per page", value: 20, default: true },
                  { label: "40 hits per page", value: 40 },
                ]}
              />
              <SortBy
                items={[
                  { label: "Relevance", value: "instant_search" },
                  { label: "Price (asc)", value: "instant_search_price_asc" },
                  { label: "Price (desc)", value: "instant_search_price_desc" },
                ]}
              />
            </div>

            <div className="CurrentRefinements">
              <ClearRefinements />
              <CurrentRefinements
                transformItems={(items) =>
                  items.map((item) => {
                    const label = item.label.startsWith(
                      "hierarchicalCategories",
                    )
                      ? "Hierarchy"
                      : item.label;

                    return {
                      ...item,
                      attribute: label,
                    };
                  })
                }
              />
            </div>
          </div>
        </div>
      </InstantSearch>
    </>
  );
}

export default SearchApp;
