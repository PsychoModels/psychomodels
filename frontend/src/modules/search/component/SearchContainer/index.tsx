import React, { useState } from "react";

import { FacetedContainer } from "../FacetedContainer";
import { SearchBox } from "../SearchBox";
import { useInstantSearch, useStats } from "react-instantsearch";
import { CurrentRefinements } from "../CurrentRefinements";
import { Alert, Button } from "flowbite-react";
import { TableCellsIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { cx } from "instantsearch-ui-components";
import { SortBy } from "../SortBy";
import { TableView } from "../TableView";
import { ListView } from "../ListView";

export const SearchContainer = () => {
  const { nbHits } = useStats();
  const { status } = useInstantSearch();

  const totalHits = `${nbHits.toLocaleString()} ${nbHits === 1 ? "result" : "results"} found`;

  const [isListView, setIsListView] = useState(true);

  return (
    <div className="flex gap-12">
      <div className="w-96">
        <FacetedContainer />
      </div>
      <div className="flex-1">
        <div className="bg-white rounded-md p-4">
          <div className="mb-2">
            <SearchBox />
          </div>

          <CurrentRefinements />
        </div>

        {Boolean(status === "idle" && nbHits === 0) && (
          <Alert color="info" rounded className="mt-4">
            No results found. Please change your search criteria.
          </Alert>
        )}

        {nbHits > 0 && (
          <>
            <div className="flex items-center mt-8 mb-4">
              <div className="text-md text-gray-700 ml-4">{totalHits}</div>
              <div className="ml-auto mr-4">
                <SortBy />
              </div>
              <Button.Group>
                <Button
                  size="sm"
                  color="gray"
                  className={cx("p-0", isListView && cx("bg-gray-200"))}
                  onClick={() => setIsListView(true)}
                >
                  <ListBulletIcon width={20} />
                </Button>

                <Button
                  color="gray"
                  size="sm"
                  onClick={() => setIsListView(false)}
                  className={cx("p-0", !isListView && cx("bg-gray-200"))}
                >
                  <TableCellsIcon width={20} />
                </Button>
              </Button.Group>
            </div>

            {isListView && <ListView />}
            {!isListView && <TableView />}
          </>
        )}
      </div>
    </div>
  );
};
