import { cx } from "instantsearch-ui-components";
import { getHighlightedParts, unescape } from "instantsearch.js/es/lib/utils";
import React from "react";
import { ClearRefinements } from "react-instantsearch";

import type { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import { Checkbox, Label } from "flowbite-react";
import { Highlight } from "./Hightlight.tsx";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

export type RefinementListProps = {
  label: string;
  canRefine: boolean;
  items: RefinementListItem[];
  onRefine: (item: RefinementListItem) => void;
  query: string;
  searchBox: React.ReactNode;
  noResults?: React.ReactNode;
  showMore?: boolean;
  canToggleShowMore: boolean;
  onToggleShowMore: () => void;
  isShowingMore: boolean;
  attribute: string;
};

export const RefinementListUi = ({
  items,
  onRefine,
  query,
  searchBox,
  noResults,
  showMore,
  canToggleShowMore,
  onToggleShowMore,
  isShowingMore,
  attribute,
  label,
}: RefinementListProps) => {
  const isRefined = items.some((item) => item.isRefined);

  return (
    <div
      className="bg-white rounded-md p-4"
      data-testid={`refinement-list-${attribute}`}
    >
      <div className="flex justify-between mb-2">
        <Label value={label} />
        {isRefined && (
          <ClearRefinements
            includedAttributes={[attribute]}
            translations={{ resetButtonText: "clear filter" }}
            classNames={{
              button: "text-sm text-gray-400 hover:text-secondary",
              root: "self-end",
            }}
          />
        )}
      </div>
      <div className="mb-3">{searchBox}</div>
      {noResults ? (
        <div className="text-md text-gray-500">{noResults}</div>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.value}
              className={cx(
                "py-0.5",

                item.isRefined && cx("ais-RefinementList-item--selected"),
              )}
            >
              <label className="text-sm pl-1 flex">
                <Checkbox
                  id="accept"
                  checked={item.isRefined}
                  value={item.value}
                  onChange={() => {
                    onRefine(item);
                  }}
                />

                <span className="align-bottom pl-3">
                  {query.length > 0 ? (
                    <Highlight
                      parts={[
                        getHighlightedParts(unescape(item.highlighted || "")),
                      ]}
                    />
                  ) : (
                    item.label
                  )}
                </span>
                <span className="align-bottom text-gray-400 pl-1">
                  ({item.count})
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {showMore && (
        <button
          className={cx(
            "text-sm text-gray-400 flex items-center mt-2 pl-1",
            !canToggleShowMore && cx("hidden"),
          )}
          disabled={!canToggleShowMore}
          onClick={onToggleShowMore}
        >
          {isShowingMore ? (
            <>
              <ChevronUpIcon height={18} />
              <span className="ml-[10px]">show less</span>
            </>
          ) : (
            <>
              <ChevronDownIcon height={18} />
              <span className="ml-[10px]">show more</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
