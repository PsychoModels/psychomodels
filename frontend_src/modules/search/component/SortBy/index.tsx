import React from "react";
import { Select } from "flowbite-react";
import { BarsArrowDownIcon } from "@heroicons/react/24/solid";
import { useSortBy } from "react-instantsearch";

const SORT_ITEMS = [
  { value: "PsychologyModel", label: "Relevance" },
  { value: "psychology_index_title_asc", label: "Title A - Z" },
  {
    value: "psychology_index_title_desc",
    label: "Title Z - A",
  },
];

export const SortBy = () => {
  const { currentRefinement, options, refine } = useSortBy({
    items: SORT_ITEMS,
  });
  return (
    <div>
      <Select
        sizing="sm"
        icon={BarsArrowDownIcon}
        value={currentRefinement}
        onChange={(event) => refine(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};
