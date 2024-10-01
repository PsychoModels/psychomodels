import React from "react";
import { ModelVariable } from "../../../../models";
import useStore from "../../store/useStore.ts";

interface Props {
  modelVariable: ModelVariable;
  actionButton?: React.ReactNode;
}

export const VariableCard = ({ modelVariable, actionButton }: Props) => {
  const { variables } = useStore((state) => state);

  const variable = variables.find(
    (variable) => variable.id === modelVariable.variableId,
  );
  return (
    <div className="p-4 border border-gray-300 bg-gray-100 rounded-lg text-gray-900 relative shadow-md">
      <h5 className="mb-2 font-semibold tracking-tight text-gray-900 dark:text-white">
        {variable?.name}
      </h5>

      <p className="mt-3 text-sm mb-1">{modelVariable.details}</p>

      <div className="text-sm mb-1">
        <span className="text-gray-600">Label:</span> {modelVariable.name}
      </div>

      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
};
