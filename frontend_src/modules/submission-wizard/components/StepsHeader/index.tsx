import React from "react";
import { Step } from "./Step.tsx";
import useStore from "../../store/useStore.ts";

export const StepsHeader = () => {
  const { completedStatus } = useStore((state) => state);

  return (
    <nav aria-label="Progress" className="pt-1">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-lg border border-gray-300 md:flex md:divide-y-0 m-5 overflow-scroll"
      >
        <Step
          stepNumber={1}
          title="Submission guidelines"
          addSeparator
          route="/"
          isCompleted={completedStatus.submissionGuidelines}
        />
        <Step
          stepNumber={2}
          title="Account"
          addSeparator
          route="/account"
          isCompleted={completedStatus.account}
        />

        <Step
          stepNumber={3}
          title="Model information"
          addSeparator
          route="/model-information"
          isCompleted={completedStatus.modelInformation}
        />
        <Step
          stepNumber={4}
          title="Publication details"
          addSeparator
          route="/publication-details"
          isCompleted={completedStatus.publicationDetails}
        />
        <Step
          stepNumber={5}
          title="Review"
          route="/review"
          isCompleted={completedStatus.review}
        />
      </ol>
    </nav>
  );
};
