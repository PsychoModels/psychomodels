import React from "react";
import {
  useClearRefinements,
  useCurrentRefinements,
} from "react-instantsearch";
import { capitalize } from "instantsearch.js/es/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";

const LABEL_MAP = {
  framework_names: "Framework",
  programming_language_name: "Programming language",
  publication_authors: "Author",
  psychology_discipline_names: "Discipline",
};

const transformItems = (items: any) => {
  return items.map((item: any) => {
    item.label = LABEL_MAP[item.label as keyof typeof LABEL_MAP] || item.label;
    return item;
  });
};

export const CurrentRefinements = () => {
  const { items, canRefine } = useCurrentRefinements({
    transformItems,
  });
  const { refine } = useClearRefinements();

  if (!canRefine) {
    return null;
  }
  return (
    <div className="mt-4">
      <ul>
        {items.map((item) => (
          <>
            {item.refinements.map((refinement) => (
              <li
                key={refinement.label + refinement.attribute}
                className="rounded-lg border-gray-300 bg-gray-50 border text-sm inline-block mr-2 mb-2"
              >
                <span className="pl-3 text-cyan-700 whitespace-nowrap inline-block align-middle">
                  {capitalize(item.label)}: {refinement?.label}
                </span>
                <span
                  className="p-1 m-0.5 text-cyan-800 hover:bg-cyan-800 hover:text-white rounded cursor-pointer inline-block align-middle"
                  onClick={() => {
                    item.refine(refinement);
                  }}
                >
                  <XMarkIcon height="16" />
                </span>
              </li>
            ))}
          </>
        ))}
        <li className="inline-block align-middle">
          <button
            className="flex text-gray-400 hover:text-secondary pt-1"
            onClick={refine}
          >
            <XCircleIcon height={20} />{" "}
            <span className="text-sm pl-1 pb-1">clear all</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
