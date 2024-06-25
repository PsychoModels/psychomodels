import React from "react";
import { Framework } from "../../../../models";
import TextTruncate from "react-text-truncate";

interface Props {
  framework: Framework;
  actionButton?: React.ReactNode;
}

export const FrameworkCard = ({ framework, actionButton }: Props) => {
  return (
    <div className="p-4 border-2 border-gray-300 rounded-[8px] shadow-lg bg-gray-100 text-gray-900 relative">
      <h5 className="mb-2 font-semibold tracking-tight text-gray-900 dark:text-white">
        {framework.name}
      </h5>

      {actionButton && (
        <div className="mb-2 absolute right-3 bottom-1">{actionButton}</div>
      )}

      <p className="mb-1 font-normal text-sm text-gray-500">
        <TextTruncate line={2} element="p" text={framework.description} />
      </p>
      <a
        href="#"
        target="_blank"
        className="inline-flex text-sm items-center text-blue-600 hover:underline"
      >
        More details
        <svg
          className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
          />
        </svg>
      </a>
    </div>
  );
};
