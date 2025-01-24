import React from "react";
import { Step } from "./Step.tsx";
import useStore from "../../store/useStore.ts";
import { useMatches } from "@tanstack/react-router";

export const StepsHeader = () => {
  const { completedStatus } = useStore((state) => state);

  const match = useMatches();
  const currentRoute = match.slice(-1)[0]?.id;

  const allCompleted = currentRoute === "/thank-you/";

  return (
    <nav aria-label="Progress" className="pt-1">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-lg border border-gray-300 md:flex md:divide-y-0 m-5"
      >
        <Step
          stepNumber={1}
          title="Submission guidelines"
          addSeparator
          route="/"
          isCompleted={completedStatus.submissionGuidelines || allCompleted}
          allowNavigate={
            !allCompleted &&
            (completedStatus.submissionGuidelines ||
              completedStatus.account ||
              completedStatus.modelInformation ||
              completedStatus.publicationDetails ||
              completedStatus.review)
          }
        />
        <Step
          stepNumber={2}
          title="Account"
          addSeparator
          route="/account"
          isCompleted={completedStatus.account || allCompleted}
          allowNavigate={
            !allCompleted &&
            (completedStatus.account ||
              completedStatus.modelInformation ||
              completedStatus.publicationDetails ||
              completedStatus.review)
          }
        />

        <Step
          stepNumber={3}
          title="Model summary"
          addSeparator
          route="/model-summary"
          isCompleted={completedStatus.modelInformation || allCompleted}
          allowNavigate={
            !allCompleted &&
            (completedStatus.modelInformation ||
              completedStatus.publicationDetails ||
              completedStatus.review)
          }
        />
        <Step
          stepNumber={4}
          title="Model Details"
          addSeparator
          route="/publication-details"
          isCompleted={completedStatus.publicationDetails || allCompleted}
          allowNavigate={
            !allCompleted &&
            (completedStatus.publicationDetails || completedStatus.review)
          }
        />
        <Step
          stepNumber={5}
          title="Review"
          route="/review"
          isCompleted={completedStatus.review || allCompleted}
          allowNavigate={!allCompleted && completedStatus.review}
        />
      </ol>
    </nav>
  );
};
