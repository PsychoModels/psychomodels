import React from "react";
import { StepsHeader } from "../StepsHeader";
import useStore from "../../store/useStore.ts";
import { SubmissionGuidelines } from "../SubmissionGuidelines";
import { AccountStep } from "../AccountStep";
import { ModelInformation } from "../ModelInformation/";

export const Container = () => {
  const { currentStep } = useStore((state) => state);

  return (
    <div className="w-full max-w-7xl bg-white rounded-lg shadow dark:border md:mt-0xl:p-0 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <StepsHeader />

      {currentStep === 1 && <SubmissionGuidelines />}
      {currentStep === 2 && <AccountStep />}
      {currentStep === 3 && <ModelInformation />}
    </div>
  );
};
