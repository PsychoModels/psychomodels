import React from "react";
import { useHits } from "react-instantsearch";
import TextTruncate from "react-text-truncate";

export const ListView = () => {
  const { items } = useHits();

  return (
    <ul className="flex flex-col gap-6" data-testid="result-list">
      {items.map((item) => (
        <li
          key={item.objectID}
          className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 hover:cursor-pointer p-4 border border-gray-300 rounded-lg text-gray-900 relative shadow-md"
          onClick={() => window.open(`/models/${item.slug}`, "_self")}
        >
          <h3 className="text-secondary font-bold mb-2 text-lg">
            {item.title}
          </h3>

          <div className="text-sm mb-1">
            <span className="text-gray-500 font-bold">Frameworks:</span>{" "}
            {item.framework_names.join(", ")}
          </div>

          {item.psychology_discipline_names.length > 0 && (
            <div className="text-sm mb-1">
              <span className="text-gray-500 font-bold">Disciplines:</span>{" "}
              {item.psychology_discipline_names.join(", ")}
            </div>
          )}

          {item.programming_language_name && (
            <div className="text-sm mb-1">
              <span className="text-gray-500 font-bold">
                Programming language:
              </span>{" "}
              {item.programming_language_name}
            </div>
          )}

          <div className=" mb-1">
            <TextTruncate line={2} element="p" text={item.description} />
          </div>
        </li>
      ))}
    </ul>
  );
};
