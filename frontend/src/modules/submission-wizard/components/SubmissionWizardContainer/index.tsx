import React from "react";
import { StepsHeader } from "../StepsHeader";
import useStore from "../../store/useStore.ts";
import { SubmissionGuidelines } from "../SubmissionGuidelines";
import { AccountStep } from "../AccountStep";
import { ModelInformation } from "../ModelInformation/";
import { PublicationDetails } from "../PublicationDetails";
import { StepsTitle } from "../StepsTitle";
import { ReviewDetails } from "../ReviewDetails";

export const SubmissionWizardContainer = () => {
  const { currentStep } = useStore((state) => state);

  return (
    <div className="pt-1">
      <StepsHeader />
      <StepsTitle />

      {currentStep === 1 && <SubmissionGuidelines />}
      {currentStep === 2 && <AccountStep />}
      {currentStep === 3 && <ModelInformation />}
      {currentStep === 4 && <PublicationDetails />}
      {currentStep === 5 && <ReviewDetails />}
    </div>
  );
};
