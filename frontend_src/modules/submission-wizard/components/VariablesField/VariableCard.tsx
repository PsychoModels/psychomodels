import React from "react";
import { ModelVariable } from "../../../../models";

interface Props {
  variable: ModelVariable;
  actionButton?: React.ReactNode;
}

export const VariableCard = ({ variable, actionButton }: Props) => {
  return (
    <div className="p-4 border border-gray-300 bg-gray-100 rounded-lg text-gray-900 relative shadow-md">
      <h5 className="mb-2 font-semibold tracking-tight text-gray-900 dark:text-white">
        {variable.name}
      </h5>

      <p className="mt-3 text-sm">{variable.description}</p>

      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
};
