import React from "react";
import useStore from "../../store/useStore.ts";
import { Seperator } from "./Seperator.tsx";
import { CheckIcon } from "@heroicons/react/24/solid";

interface Props {
  stepNumber: number;
  title?: string;
  addSeperator?: boolean;
}

export const Step = ({ stepNumber, title = "", addSeperator }: Props) => {
  const currentStep = useStore((state) => state.currentStep);

  const isActive = stepNumber === currentStep;
  const isCompleted = stepNumber < currentStep;

  if (isActive) {
    return (
      <li className="relative md:flex md:flex-1">
        <div
          className="flex items-center px-6 py-4 text-sm font-medium"
          aria-current="step"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-cyan-800">
            <span className="text-secondary">{stepNumber}</span>
          </span>
          <span className="ml-4 text-sm font-medium text-secondary">
            {title}
          </span>
        </div>
        {addSeperator && <Seperator />}
      </li>
    );
  }

  if (isCompleted) {
    return (
      <li className="relative md:flex md:flex-1">
        <div className="group flex w-full items-center">
          <span className="flex items-center px-6 py-4 text-sm font-medium">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-700">
              <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <span className="ml-4 text-sm font-medium text-cyan-700">
              {title}
            </span>
          </span>
        </div>
        {addSeperator && <Seperator />}
      </li>
    );
  }

  return (
    <li className="relative md:flex md:flex-1">
      <div className="group flex items-center">
        <span className="flex items-center px-6 py-4 text-sm font-medium">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
            <span className="text-gray-500">{stepNumber}</span>
          </span>
          <span className="ml-4 text-sm font-medium text-gray-500">
            {title}
          </span>
        </span>
      </div>
      {addSeperator && <Seperator />}
    </li>
  );
};
