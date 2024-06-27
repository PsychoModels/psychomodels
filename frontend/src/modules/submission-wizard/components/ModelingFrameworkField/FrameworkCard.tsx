import React from "react";
import { Framework } from "../../../../models";
import TextTruncate from "react-text-truncate";
import NewWindowIcon from "../../../shared/components/Icons/NewWindowIcon.tsx";

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

      <div className="mb-1 font-normal text-sm text-gray-500">
        <TextTruncate line={2} element="p" text={framework.description} />
      </div>
      {!framework.isNew && (
        <a
          href="#"
          target="_blank"
          className="inline-flex text-sm items-center text-blue-600 hover:underline"
        >
          More details
          <NewWindowIcon />
        </a>
      )}
    </div>
  );
};
