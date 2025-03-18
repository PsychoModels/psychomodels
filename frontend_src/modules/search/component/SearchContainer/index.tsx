import React, { useState } from "react";

import { FacetedContainer } from "../FacetedContainer";
import { SearchBox } from "../SearchBox";
import { useStats } from "react-instantsearch";
import { CurrentRefinements } from "../CurrentRefinements";
import { Alert, Button, Drawer } from "flowbite-react";
import {
  TableCellsIcon,
  ListBulletIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import { cx } from "instantsearch-ui-components";
import { SortBy } from "../SortBy";
import { TableView } from "../TableView";
import { ListView } from "../ListView";
import { NoResultsBoundary } from "../NoResultsBoundary";
import { Pagination } from "../Pagination";

export const SearchContainer = () => {
  const { nbHits } = useStats();

  const totalHits = `${nbHits.toLocaleString()} ${nbHits === 1 ? "result" : "results"} found`;

  const [isListView, setIsListView] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="flex gap-8">
      <div className="w-96 hidden md:block">
        <FacetedContainer />
      </div>
      <div className="flex-1">
        <div className="bg-white rounded-md p-4">
          <div className="mb-2">
            <SearchBox />
          </div>

          <CurrentRefinements />
        </div>

        <NoResultsBoundary
          fallback={
            <Alert color="info" rounded className="mt-4">
              No results found. Please change your search criteria.
            </Alert>
          }
        >
          <>
            <div className="flex items-center mt-8 mb-4">
              <Button
                size="sm"
                color="gray"
                className="p-0 mr-2 md:hidden"
                onClick={toggleDrawer}
              >
                <FunnelIcon width={20} />
              </Button>
              <div
                className="text-md text-gray-700 ml-4"
                data-testid="total-hits"
              >
                {totalHits}
              </div>
              <div className="mr-4 md:ml-auto hidden md:block">
                <SortBy />
              </div>
              <Button.Group className="ml-auto md:ml-0">
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

            {nbHits > 0 && <Pagination />}
          </>
        </NoResultsBoundary>
      </div>

      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        className="bg-gray-100 z-999"
      >
        <Drawer.Header>
          <button onClick={toggleDrawer} className="mb-20">
            Close
          </button>
        </Drawer.Header>
        <Drawer.Items>
          <FacetedContainer />
        </Drawer.Items>
      </Drawer>
    </div>
  );
};
